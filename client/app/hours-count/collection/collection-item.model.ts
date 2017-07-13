export class CollectionItem {
  constructor(
    public uuid: string,
    public status: string,
    public isLoading: boolean,
    public object
  ) {};
}
