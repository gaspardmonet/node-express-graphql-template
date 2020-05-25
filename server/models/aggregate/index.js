import { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat } from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';
import escape from 'pg-escape';
import { client } from 'database';
import { handleAggregateQueries, queryOptions } from './purchasedItemsUtils';

const Aggregate = new GraphQLObjectType({
  name: 'Aggregate',
  fields: () => ({
    max: {
      type: new GraphQLObjectType({
        name: 'AggregateMax',
        fields: () => ({
          purchasedItemsPrice: {
            name: 'MaxPriceOfPurchasedItems',
            type: GraphQLInt,
            resolve: async args => {
              const query = `SELECT MAX(price) from purchased_items`;
              const { where, join } = handleAggregateQueries(args);
              return (await client.query(escape(`${query} ${join} ${where};`), queryOptions(args)))[0].max || 0;
            }
          }
        }),
        resolve: args => args
      })
    },
    total: {
      type: new GraphQLObjectType({
        name: 'AggregateSum',
        fields: () => ({
          purchasedItemsPrice: {
            name: 'TotalPriceOfPurchasedItems',
            type: GraphQLFloat,
            resolve: async args => {
              const query = `SELECT SUM(price) from purchased_items`;
              const { where, join } = handleAggregateQueries(args);
              return (await client.query(escape(`${query} ${join} ${where};`), queryOptions(args)))[0].sum || 0;
            }
          }
        })
      }),
      resolve: args => args
    },
    count: {
      type: new GraphQLObjectType({
        name: 'AggregateCount',
        fields: () => ({
          purchasedItems: {
            name: 'CountOfPurchasedItems',
            type: GraphQLFloat,
            resolve: async args => {
              const query = `SELECT COUNT(*) from purchased_items`;
              const { where, join } = handleAggregateQueries(args);
              return (await client.query(escape(`${query} ${join} ${where};`), queryOptions(args)))[0].count || 0;
            }
          }
        })
      }),
      resolve: args => args
    }
  })
});

const AggregateType = {
  type: Aggregate,
  args: {
    startDate: { type: GraphQLDateTime },
    endDate: { type: GraphQLDateTime },
    category: { type: GraphQLString }
  },
  resolve: (_, args) => args
};
export { AggregateType as Aggregate };
