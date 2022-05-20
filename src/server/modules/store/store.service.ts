import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Store } from 'server/data/models';
import { StoreRepository } from 'server/data/repositories';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(StoreRepository)
    private readonly storeRepository: StoreRepository,
  ) {}

  getOne(storeUUID: string, relations = []) {
    return this.storeRepository.findOne({
      where: { uuid: storeUUID },
      relations,
    });
  }

  getList(params: object, relations = []): Promise<Store[]> {
    const limit = params["limit"]
    const offset = params["offset"]
     
    limit ? delete params["limit"] : null
    offset ? delete params["offset"] : null

    return this.storeRepository.find({
      where: params,
      skip: offset || 0,
      take: limit || 10,
      relations,
    });
  }
}