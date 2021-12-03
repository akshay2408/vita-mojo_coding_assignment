import { EntityRepository, Repository } from 'typeorm';

import { Store } from 'data/models';

@EntityRepository(Store)
export class StoreRepository extends Repository<Store> {}
