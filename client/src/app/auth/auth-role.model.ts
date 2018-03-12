export class AuthRole {
  constructor(
    public id: number,
    public code: string,
    public name: string
  ) { };

  /**
   * Return JSON representation of the object.
   */
  public toJSON(){
    return {
      id: this.id,
      name : this.name,
      code: this.code
    }
  };
}