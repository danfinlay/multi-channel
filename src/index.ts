export default {
  createHub,
} 

function createHub (hubOpts: { name: string } = { name: `Hub ${Math.random()}`}) {

  const hub: Hub = {
    create: createChannel,
    actions: {},
  };

  function createChannel (channelOpts: ChannelOptions = {
    name: `Channel ${Math.random()}`,
    actions: {},
    permittedActions: [],
  }) {

    hub.actions[channelOpts.name] = channelOpts.actions;

    const channel = {};

    channelOpts.permittedActions.forEach((actionName) => {
      const parts = actionName.split('.');
      
      let invokableObj: ControllerReference = {};
      addApprovedMethodsToInvokable(parts, invokableObj, hub); 

    })

    return channel;
  }

  return hub;
}

function addApprovedMethodsToInvokable (parts: string[], invokable: ControllerReference, hub: Hub): ControllerReference {
  if (parts.length === 0 || typeof parts[0] === 'undefined') {
    return invokable;
  }

  const key: string | undefined = parts.shift();
  if (typeof key === 'undefined') {
    return invokable;
  }

  const child: ControllerReference = {};
  invokable[key] = child;
  return addApprovedMethodsToInvokable(parts, child, hub);
}

interface Hub {
  create: (channelOpts: ChannelOptions) => Channel;
  actions: {[controllerName: string]: ControllerReference};
}

type Channel = {
  [key:string]: ControllerReference;
}

type ChannelOptions = { name: string, permittedActions: string[], actions: ControllerReference } 

type ControllerReference = {[key:string]: ControllerReference | Function }