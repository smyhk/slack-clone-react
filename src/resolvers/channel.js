import formatErrors from '../../formatErrors';

export default {
  Mutation: {
    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel
        };
      } catch (err) {
        console.info(err);
        return {
          ok: false,
          erros: formatErrors(err, models)
        };
      }
    }
  }
};
