import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';
import { connectionDefinitions, forwardConnectionArgs } from 'graphql-relay';
import { nodeInterface } from 'server/node';
import { Product } from './products';
import { timestamps } from './timestamps';
import { GraphQLDateTime } from 'graphql-iso-date';

const PurchasedProduct = new GraphQLObjectType({
  name: 'PurchasedProduct',
  interface: [nodeInterface],
  args: forwardConnectionArgs,
  sqlPaginate: true,
  orderBy: {
    created_at: 'desc',
    id: 'asc'
  },
  fields: () => ({
    id: { type: GraphQLInt },
    price: { type: GraphQLInt },
    discount: { type: GraphQLInt },
    deliveryDate: { sqlColumn: 'delivery_date', type: GraphQLDateTime },
    ...timestamps,
    product: {
      type: Product,
      sqlJoin: (purchasedProductTable, productTable, args) => `${productTable}.id = ${purchasedProductTable}.product_id`
    }
  })
});

PurchasedProduct._typeConfig = {
  sqlTable: 'purchased_products',
  uniqueKey: 'id'
};

const { connectionType: PurchasedProductConnection } = connectionDefinitions({
  nodeType: PurchasedProduct,
  connectionFields: {
    total: {
      type: GraphQLNonNull(GraphQLInt)
    }
  }
});

export { PurchasedProduct, PurchasedProductConnection };
