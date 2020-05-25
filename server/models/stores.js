import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLInt
} from 'graphql';
import {
    connectionDefinitions,
    connectionFromArray,
    forwardConnectionArgs
} from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { StoreItemConnection } from './storeItems';
import { Address } from './addresses';
import { timestamps } from './timestamps';

const Store = new GraphQLObjectType({
    name: 'Store',
    interface: [nodeInterface],
    args: forwardConnectionArgs,
    sqlPaginate: true,
    orderBy: {
        created_at: 'desc',
        id: 'asc'
    },
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        ...timestamps,
        address: {
            type: Address,
            sqlJoin: (storeTable, addressTable, args) =>
                `${addressTable}.id = ${storeTable}.address_id`
        },
        items: {
            type: StoreItemConnection,
            args: forwardConnectionArgs,
            sqlPaginate: true,
            orderBy: 'id',
            sqlJoin: (storeTable, storeItemTable, args) =>
                `${storeTable}.id = ${storeItemTable}.store_id`,
            resolve: (store, args) => connectionFromArray(store.items, args)
        }
    })
});

Store._typeConfig = {
    sqlTable: 'stores',
    uniqueKey: 'id'
};

const { connectionType: StoreConnection } = connectionDefinitions({
    nodeType: Store,
    connectionFields: {
        total: {
            type: GraphQLNonNull(GraphQLInt)
        }
    }
});

export { Store, StoreConnection };
