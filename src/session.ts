interface ISessions {
  [correlatorId: string]: any;
}
const sessions: ISessions = {};

function getCorrelatorId(contactPhone: string, businessPhone: string): string {
  return `${contactPhone}::${businessPhone}`;
}

export function get(contactPhone: string, businessPhone: string) {
  const correlatorId = getCorrelatorId(contactPhone, businessPhone);
  const session = sessions[correlatorId];
  if (session) {
    return session;
  }
  return {};
}

export function save(contactPhone: string, businessPhone: string, session: any) {
  const correlatorId = getCorrelatorId(contactPhone, businessPhone);
  sessions[correlatorId] = session;
}
