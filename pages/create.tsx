import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';

import { CopyButton } from '../components/common/CopyButton';
import { PageWrapper } from '../components/common/PageWrapper';
import { CreatePlayerForm } from '../components/playerForms/createPlayer/CreatePlayerForm';
import {
  CreatePlayerFormValidation,
  createPlayerValidationSchema,
  defaultPlayer,
  mapPlayerToFormValues,
} from '../components/playerForms/shared';
import { useSession } from '../contexts/AuthContext';
import { ToastContext } from '../contexts/ToastContext';
import { useCurrentPlayer } from '../hooks/useCurrentPlayer';
import { useRetirementMutation } from '../hooks/useRetirementMutation';
import { useUpdateEvents } from '../hooks/useUpdateEvents';
import { SHL_GENERAL_DISCORD } from '../lib/constants';
import DiscordLogo from '../public/discord.svg';
import { mutate } from '../utils/query';

export default () => {
  const router = useRouter();
  const { session, loggedIn } = useSession();
  const { player, loading, canUnretire, status } = useCurrentPlayer();
  const [createNew, setCreateNew] = useState(false);

  const { updateFlags, loading: updateEventsLoading } = useUpdateEvents(
    player?.pid,
  );

  const shouldShowUnretireMessage = useMemo(
    () =>
      canUnretire &&
      !updateEventsLoading &&
      !updateFlags.unRetirementProcessed &&
      !createNew,

    [createNew, canUnretire, updateEventsLoading, updateFlags],
  );

  useEffect(() => {
    if (loggedIn && !loading) {
      if (status === 'active' || status === 'pending') {
        router.replace('/player');
      }
    }
  }, [loading, loggedIn, router, status]);

  const { addToast } = useContext(ToastContext);

  useEffect(() => {
    if (!loggedIn) {
      router.replace('/');
    }
  }, [loggedIn, router]);

  const createPlayer = useMutation<
    // TODO: type return type
    unknown,
    unknown,
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/player/create', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const adjustPlayer = useMutation<
    // TODO: type return type
    unknown,
    unknown,
    // TODO: type variables a bit stricter
    Record<string, unknown>
  >({
    mutationFn: (variables) =>
      mutate('api/v1/player/adjust', variables, {
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }),
  });

  const initialFormValues: CreatePlayerFormValidation = useMemo(() => {
    if (player && player.status === 'denied') {
      return mapPlayerToFormValues(player);
    } else {
      return defaultPlayer;
    }
  }, [player]);

  const {
    errors,
    touched,
    values,
    isSubmitting,
    isValid,
    initialValues,
    handleBlur,
    handleChange,
    setFieldValue,
    handleSubmit,
    resetForm,
  } = useFormik<CreatePlayerFormValidation>({
    validateOnBlur: true,
    validateOnChange: false,
    enableReinitialize: true,
    initialValues: initialFormValues,
    onSubmit: (
      { skater, goalie, availableTPE, ...info },
      { setSubmitting },
    ) => {
      setSubmitting(true);

      const birthplace =
        info.birthCountry === 'Other'
          ? `${info.birthCity}, ${info.customBirthCountry}`
          : `${info.birthCity}, ${info.birthCountry}`;

      const playerMutation = status === 'denied' ? adjustPlayer : createPlayer;

      playerMutation.mutate(
        {
          pid: player?.pid,
          skater,
          goalie,
          availableTPE,
          info: {
            birthplace,
            // Filter out internal-only keys
            ...Object.fromEntries(
              Object.entries(info).filter(
                ([key]) =>
                  ![
                    'heightFeet',
                    'heightInches',
                    'birthCountry',
                    'customBirthCountry',
                    'birthCity',
                  ].includes(key),
              ),
            ),
          },
        },
        {
          onError: () => {
            addToast({
              title: 'Player not created',
              description:
                'We were unable to create your player. Please try again.',
              status: 'error',
            });
            setSubmitting(false);
          },
          onSuccess: () => {
            router.push('/player');
          },
        },
      );
    },
    validationSchema: createPlayerValidationSchema,
  });

  const { submitRetire, isSubmitting: isUnretireSubmitted } =
    useRetirementMutation(player?.pid, 'unretire');

  const [isUnretirementModalOpen, setIsUnretirementModalOpen] = useState(false);
  const [unretirementConfirmationText, setUnretirementConfirmationText] =
    useState('');

  return (
    <PageWrapper loading={loading}>
      {(!player || status === 'retired' || status === 'denied') && (
        <>
          {status === 'denied' && (
            <div className="mx-auto mt-4 flex w-11/12 flex-col md:w-3/5">
              <Alert
                status="warning"
                variant="top-accent"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <AlertIcon />
                <AlertTitle>Your new player was denied.</AlertTitle>
                <AlertDescription fontSize="md" className="flex">
                  <div>
                    But don&apos;t worry! Our Rookie Mentors are on standby to
                    help, as this is usually due to recommendations on your
                    build. Once you know what needs to be adjusted, come back
                    here and resubmit with your changes.
                  </div>
                  <div className="mt-4 flex justify-center">
                    <Link
                      className="text-lg font-bold"
                      href={SHL_GENERAL_DISCORD}
                      target="_blank"
                    >
                      To follow-up on your submission, join our Discord.
                      <div className="mt-2 flex justify-center">
                        <DiscordLogo className="max-h-10" />
                      </div>
                    </Link>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
          {shouldShowUnretireMessage && status !== 'denied' && (
            <div className="mx-auto mt-4 flex w-11/12 flex-col md:w-3/5">
              <Alert
                status="info"
                variant="top-accent"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <AlertIcon />
                <AlertTitle>You have a recently retired player</AlertTitle>
                <AlertDescription fontSize="md">
                  You can still choose to unretire {player?.name}. By doing so
                  you will incur a 15% TPE penalty.{' '}
                  {updateFlags.retirementProcessed
                    ? 'As you have already unretired this character once, this would be the final unretirement. Any future retirement would be final.'
                    : ''}
                  <div className="bottom-0 flex items-center p-2">
                    <Button
                      colorScheme="gray"
                      type="button"
                      className="mr-2 w-1/2"
                      isDisabled={isSubmitting}
                      onClick={() => setIsUnretirementModalOpen(true)}
                    >
                      Unretire Player
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="button"
                      className="w-1/2"
                      isDisabled={isSubmitting}
                      onClick={() => setCreateNew(true)}
                    >
                      Create New Player
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div className="mt-4">
            <CreatePlayerForm
              isSubmitting={isSubmitting}
              isValid={isValid}
              initialValues={initialValues}
              errors={errors}
              touched={touched}
              values={values}
              handleBlur={handleBlur}
              setFieldValue={setFieldValue}
              handleSubmit={handleSubmit}
              handleChange={handleChange}
              resetForm={resetForm}
            />
          </div>

          <Modal
            size="lg"
            isOpen={isUnretirementModalOpen}
            onClose={() => setIsUnretirementModalOpen(false)}
            isCentered
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Unretire Player</ModalHeader>
              <ModalCloseButton isDisabled={isUnretireSubmitted} />
              <ModalBody>
                <Alert variant="subtle" status="error" className="mb-4">
                  <AlertIcon />
                  <AlertDescription fontSize="sm">
                    Are you sure you want to unretire? There will be a 15% TPE
                    penalty applied to your player.
                    <br />
                    Enter your player name below to proceed.
                    <CopyButton
                      className="ml-2"
                      aria-label="Copy player name to clipboard"
                      colorScheme="blackAlpha"
                      size="sm"
                      variant="unstyled"
                      value={player?.name ?? ''}
                    />
                  </AlertDescription>
                </Alert>
                <Input
                  onChange={(e) =>
                    setUnretirementConfirmationText(e.currentTarget.value)
                  }
                ></Input>
              </ModalBody>
              <ModalFooter className="bottom-0 flex items-center p-2">
                <Button
                  colorScheme="gray"
                  type="button"
                  className="mr-2 w-1/2"
                  isDisabled={isUnretireSubmitted}
                  onClick={() => setIsUnretirementModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  type="button"
                  className="w-1/2"
                  isDisabled={
                    unretirementConfirmationText !== player?.name ||
                    isUnretireSubmitted
                  }
                  isLoading={isUnretireSubmitted}
                  onClick={submitRetire}
                >
                  Unretire Player
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </PageWrapper>
  );
};
