import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './modules/user/user.module';
// import { getMetadataArgsStorage } from 'typeorm'
import { TypeormModule } from './config/typeorm/typeorm.module'
import { TypeormService } from './config/typeorm/typeorm.service'
import { AuthenticationError } from 'apollo-server-express';
import { ApolloError } from 'apollo-server-core'

import * as jwt from 'jsonwebtoken';
import { getMongoRepository } from 'typeorm';
import { User } from './modules/user/user.entity';
import { RoleModule } from './modules/role/role.module';
import { PetModule } from './modules/pet/pet.module';
import { join } from 'path';
import { ProductModule } from './modules/product/product.module';
import { OrderProductModule } from './modules/orderProduct/orderProduct.module';
import { BillProductModule } from './modules/billProduct/billProduct.module';
import { ServiceModule } from './modules/service/service.module';
import { BillServicetModule } from './modules/billService/billService.module';

const directiveResolvers = {
  isAuthenticated: (next, source, args, ctx) => {
    const message = 'Token Required'
				const code = '499'
				const additionalProperties = {}

        const { currentUser } = ctx
				if (!currentUser) {
					throw new ApolloError(message, code, additionalProperties)
				}
				return next()
    },
  //   hasPermission: async (next, source, args, ctx) => {
  //     const { code } = args
  //     const { currentUser } = ctx

  //     if (!currentUser) {
  //       throw new Error('You are not authenticated!')
  //     }
  //     const permisisonRequired = await getMongoRepository(Permission).findOne({code})
  //     // console.log(permisisonRequired, currentUser )
  //     const rolePermissionRequired = await getMongoRepository(RolePermission).findOne({
  //       idRole: currentUser.role._id, 
  //       idPermission: permisisonRequired._id
  //     })
  //     // console.log(rolePermissionRequired)
  //     if (!rolePermissionRequired) {
  //       throw new Error(
  //         `You don't have role!`
  //       )
  //     }
  //     return next()
  // },
  hasRole: async (next, source, args, ctx) => {
    const { code } = args
    const { currentUser } = ctx

    if (!currentUser) {
      throw new Error('You are not authenticated!')
    }
    if(code!==currentUser.role.code) {
      throw new Error("You don't have role!")
    }
    return next()
},
};

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
				path: join(process.cwd(), 'src/graphql.ts'),
				outputAs: 'class'
			},
      directiveResolvers,
      context: async ({ req, res, connection }) => {
        if (connection) {
					return {
						req: connection.context,
					}
				}
        let currentUser;
        const token = req.headers.token
       // const service = this.authService.hello();
        // console.log(service);
        //console.log(currentUser)
        if (token) {
          const message = 'Invalid Token'
					const code = '498'
					const additionalProperties = {}
          try {
						let decodeToken
            decodeToken = await jwt.verify(token, process.env.JWT_SECRET)
            const _id = decodeToken.id
            //  console.log(decodeToken)
            currentUser = await getMongoRepository(User).findOne({_id})
					} catch (error) {
						throw new ApolloError(message, code, additionalProperties)
          }
        }

        return {
          req,
          res,
          currentUser
        };
      },
      debug: false,
      playground: true
    }),
    TypeOrmModule.forRootAsync({
			useClass: TypeormService
    }),
    MulterModule.register({
      dest: './files',
    }),
    /* TypeOrmModule.forRoot({
      type: "mongodb",
      url:"mongodb+srv://sa:qsWGRPWsrfwipbei@cluster0-fpeww.mongodb.net/admin?retryWrites=true&w=majority",
      database: "test", 
			entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: true,
      useNewUrlParser: true,
      logging: true,
    }), */
    UserModule,
    TypeormModule,
    RoleModule,    
    PetModule,
    ProductModule,
    OrderProductModule,
    BillProductModule,
    ServiceModule,
    BillServicetModule
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}