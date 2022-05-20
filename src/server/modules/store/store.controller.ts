import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { StoreService } from './store.service';
import { StoreTransformer } from './store.transformer';

const { Parser } = require('json2csv');

@Controller('api/stores')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Get()
  async getList(@Query() query): Promise<StoreTransformer[]> {

    const stores = await this.storeService.getList(query);
    return plainToInstance(StoreTransformer, stores);
  }

  /**
   * this endpoint should export all stores from database as a csv file
   * */
  @Get('export')
  async export(@Query() query) {
    const csvQuery = query ? query : {} 
    const stores = await this.storeService.getList(csvQuery);
    const jsonToCsv = new Parser();
    return jsonToCsv.parse(stores);
  }
}