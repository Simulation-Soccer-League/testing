import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

import { Player, SkaterAttributes } from '../../../../typings';

export const SkaterAttributeTable = ({ player }: { player: Player }) => {
  return (
    <>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>Offensive Ratings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Screening</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).screening}
              </Td>
            </Tr>
            <Tr>
              <Td>Getting Open</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).gettingOpen}
              </Td>
            </Tr>
            <Tr>
              <Td>Passing</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).passing}
              </Td>
            </Tr>
            <Tr>
              <Td>Puckhandling</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).puckhandling}
              </Td>
            </Tr>
            <Tr>
              <Td>Shooting Accuracy</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).shootingAccuracy}
              </Td>
            </Tr>
            <Tr>
              <Td>Shooting Range</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).shootingRange}
              </Td>
            </Tr>
            <Tr>
              <Td>Offensive Read</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).offensiveRead}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>Defensive Ratings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Checking</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).checking}
              </Td>
            </Tr>
            <Tr>
              <Td>Hitting</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).hitting}
              </Td>
            </Tr>
            <Tr>
              <Td>Positioning</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).positioning}
              </Td>
            </Tr>
            <Tr>
              <Td>Stickchecking</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).stickchecking}
              </Td>
            </Tr>
            <Tr>
              <Td>Shot Blocking</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).shotBlocking}
              </Td>
            </Tr>
            <Tr>
              <Td>Faceoffs</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).faceoffs}
              </Td>
            </Tr>
            <Tr>
              <Td>Defensive Read</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).defensiveRead}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>Physical Ratings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Acceleration</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).acceleration}
              </Td>
            </Tr>
            <Tr>
              <Td>Agility</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).agility}
              </Td>
            </Tr>
            <Tr>
              <Td>Balance</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).balance}
              </Td>
            </Tr>
            <Tr>
              <Td>Speed</Td>
              <Td isNumeric>{(player.attributes as SkaterAttributes).speed}</Td>
            </Tr>
            <Tr>
              <Td>Stamina</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).stamina}
              </Td>
            </Tr>
            <Tr>
              <Td>Strength</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).strength}
              </Td>
            </Tr>
            <Tr>
              <Td>Fighting</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).fighting}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>Mental Ratings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Aggression</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).aggression}
              </Td>
            </Tr>
            <Tr>
              <Td>Bravery</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).bravery}
              </Td>
            </Tr>
            <Tr>
              <Td>Determination</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).determination}
              </Td>
            </Tr>
            <Tr>
              <Td>Team Player</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).teamPlayer}
              </Td>
            </Tr>
            <Tr>
              <Td>Leadership</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).leadership}
              </Td>
            </Tr>
            <Tr>
              <Td>Temperament</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).temperament}
              </Td>
            </Tr>
            <Tr>
              <Td>Professionalism</Td>
              <Td isNumeric>
                {(player.attributes as SkaterAttributes).professionalism}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
