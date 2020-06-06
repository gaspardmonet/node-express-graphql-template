import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'gql/node';
import { Product } from './products';
import { Store } from './stores';
import { timestamps } from './timestamps';

const StoreProduct = new GraphQLObjectType({
  name: 'StoreProduct',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    id: { type: GraphQLInt },
    ...timestamps,
    product: {
      type: Product,
      sqlJoin: (storeProductsTable, productTable, args) => `${productTable}.id = ${storeProductsTable}.product_id`
    },
    store: {
      type: Store,
      sqlJoin: (storeProductsTable, storeTable, args) => `${storeTable}.id = ${storeProductsTable}.store_id`
    }
  })
});

StoreProduct._typeConfig = {
  sqlTable: 'store_products',
  uniqueKey: 'id'
};

const { connectionType: StoreProductConnection } = connectionDefinitions({
  nodeType: StoreProduct,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { StoreProduct, StoreProductConnection };
