export class EventModel {
    constructor(
      public title: string,
      public location: string,
      public startDateTime: Date,
      public endDateTime: Date,
      public viewPublic: boolean,
      public description?: string,
      public _id?: string,
    ) { }
}
