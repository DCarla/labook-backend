export class User {
  constructor(
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private role: string,
    private created_at: string
  ) {}
  public getId(): string {
    return this.id;
  }

  public setId(value: string): void {
    this.id = value;
  }
  public getname(): string {
    return this.id;
  }

  public setname(value: string): void {
    this.id = value;
  }
  public getemail(): string {
    return this.id;
  }

  public setemail(value: string): void {
    this.id = value;
  }
  public getpassword(): string {
    return this.id;
  }

  public setpassword(value: string): void {
    this.id = value;
  }
  public getrole(): string {
    return this.id;
  }

  public setrole(value: string): void {
    this.id = value;
  }
  public getcreate_at(): string {
    return this.id;
  }

  public setcreate_at(value: string): void {
    this.id = value;
  }
}
