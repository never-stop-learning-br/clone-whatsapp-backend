import { Prop } from '@nestjs/mongoose';

export class CommonFields {
  @Prop({
    type: Date,
    required: [false],
  })
  public deletedAt: Date;
}
