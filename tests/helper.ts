// yolo
import get = require("lodash.get");

export const send = async (
  app: any,
  intentName: string,
  {
    project = "projectid1234",
    session = "123456789",
    aogData = {}, // conv.data
    requestData = {}, // data that goes with the REQUEST
  } = {}
) => {
  const AOG_DATA = JSON.stringify(aogData);
  const aog = {
    name: `projects/${project}/agent/sessions/${session}/contexts/_actions_on_google`,
    lifespanCount: 99,
    parameters: { data: AOG_DATA },
  };
  const req = {
    queryResult: {
      intent: { displayName: intentName },
      outputContexts: [aog],
    },
    session: `projects/${project}/agent/sessions/${session}`,
    originalDetectIntentRequest: {
      payload: requestData,
    },
  };
  const res = await app(req, {}).catch((e: any) => console.log("#", e));
  return res;
};

export const _ = { get };
