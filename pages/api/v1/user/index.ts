import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import SQL from 'sql-template-strings';

import { checkUserAuthorization } from '../../../../lib/checkUserAuthorization';
import { userQuery } from '../../../../lib/db';
import use from '../../../../lib/middleware';

const DEFAULT_SHL_URL = `https://simulationhockey.com/`;

export type BaseUserData = {
  uid: number;
  username: string;
  avatar: string;
};

const cors = Cors({
  methods: ['GET', 'HEAD'],
});

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  await use(req, res, cors);

  if (req.method !== 'GET') {
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  if (!(await checkUserAuthorization(req))) {
    res.status(401).end(`Not authorized`);
    return;
  }

  const response = await userQuery<{
    uid: number;
    username: string;
    avatar: string;
    avatartype: 'remote' | 'upload' | '0' | '';
  }>(SQL`
    SELECT uid, username, avatar, avatartype
    FROM mybb_users
    WHERE uid=${req.cookies.userid}
  `);

  if ('error' in response || response.length === 0) {
    res.status(500).end('Server connection failed');
    return;
  }

  const [user] = response;

  const userAvatar =
    user.avatartype === 'upload'
      ? `${DEFAULT_SHL_URL}${user.avatar.substring(2)}`
      : user.avatartype !== '' && user.avatar !== 'noavatar'
      ? user.avatar
      : `${DEFAULT_SHL_URL}images/default_avatar.png`;

  res.status(200).json({
    uid: user.uid,
    username: user.username,
    avatar: userAvatar,
  });
};
