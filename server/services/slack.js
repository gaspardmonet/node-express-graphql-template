import slackNotify from 'slack-notify';
import { logger } from '@utils';
import rTracer from 'cls-rtracer';

let slack;
function getSlackInstance() {
  if (!slack) {
    slack = slackNotify(process.env.SLACK_WEBHOOK_URL);
  }
  return slack;
}
export async function sendMessage(text) {
  if (['production', 'development', 'local'].includes(process.env.ENVIRONMENT_NAME)) {
    getSlackInstance()
      .send({
        text: JSON.stringify({ requestId: rTracer.id(), error: text, env: process.env.ENVIRONMENT_NAME }),
        username: 'node-express-alerts'
      })
      .catch(err => logger().error(`Slack error: ${err}. Please check webhook url`));
  }
}
