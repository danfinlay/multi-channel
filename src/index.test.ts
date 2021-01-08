import multiChannel from './index';

describe('Basic action', () => {
  it('can allow one controller to invoke an action on another', async () => {
    const hub = multiChannel.createHub();

    const guestChannel = hub.create({
      name: 'guest',
      permittedActions: ['host.greet'],
    });
    const name = 'Huey';

    /** The assertion itself.
    *   Requires the consumer can register its interest before the producer is even online.
    **/
    expect(guestChannel.host.greet( name )).resolves.toEqual('Hello, Huey!');

    const host = {
	greet: (name: string) => `Hello, ${name}!`,	
    };
    hub.create({
      name: 'host',
      actions: {
	greet: host.greet,
      }
    });
  });
});
