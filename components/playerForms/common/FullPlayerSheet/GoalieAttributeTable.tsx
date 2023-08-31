import {
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react';

import { GoalieAttributes, Player } from '../../../../typings';

export const GoalieAttributeTable = ({ player }: { player: Player }) => {
  return (
    <>
      <TableContainer>
        <Table variant="striped" size="sm">
          <Thead>
            <Tr>
              <Th colSpan={2}>Goalie Ratings</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Blocker</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).blocker}
              </Td>
            </Tr>
            <Tr>
              <Td>Glove</Td>
              <Td isNumeric>{(player.attributes as GoalieAttributes).glove}</Td>
            </Tr>
            <Tr>
              <Td>Passing</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).passing}
              </Td>
            </Tr>
            <Tr>
              <Td>Poke Check</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).pokeCheck}
              </Td>
            </Tr>
            <Tr>
              <Td>Positioning</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).positioning}
              </Td>
            </Tr>
            <Tr>
              <Td>Rebound</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).rebound}
              </Td>
            </Tr>
            <Tr>
              <Td>Recovery</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).recovery}
              </Td>
            </Tr>
            <Tr>
              <Td>Puckhandling</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).puckhandling}
              </Td>
            </Tr>
            <Tr>
              <Td>Low Shots</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).lowShots}
              </Td>
            </Tr>
            <Tr>
              <Td>Reflexes</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).reflexes}
              </Td>
            </Tr>
            <Tr>
              <Td>Skating</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).skating}
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
                {(player.attributes as GoalieAttributes).aggression}
              </Td>
            </Tr>
            <Tr>
              <Td>Mental Toughness</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).mentalToughness}
              </Td>
            </Tr>
            <Tr>
              <Td>Determination</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).determination}
              </Td>
            </Tr>
            <Tr>
              <Td>Team Player</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).teamPlayer}
              </Td>
            </Tr>
            <Tr>
              <Td>Leadership</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).leadership}
              </Td>
            </Tr>
            <Tr>
              <Td>Goaltender Stamina</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).goaltenderStamina}
              </Td>
            </Tr>
            <Tr>
              <Td>Professionalism</Td>
              <Td isNumeric>
                {(player.attributes as GoalieAttributes).professionalism}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
