export class Posts {
  constructor(
    private id: string,
    private creatorId: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public setId(v: string): void {
    this.id = v;
  }

  public getCreatorId(): string {
    return this.creatorId;
  }

  public setCreatorId(v: string): void {
    this.creatorId = v;
  }

  public getContent(): string {
    return this.content;
  }

  public setContent(v: string): void {
    this.content = v;
  }

  public getLikes(): number {
    return this.likes;
  }

  public setLikes(v: number): void {
    this.likes = v;
  }

  public getDislikes(): number {
    return this.dislikes;
  }

  public setDislikes(v: number): void {
    this.dislikes = v;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public setCreatedAt(v: string): void {
    this.createdAt = v;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public setUpdatedAt(v: string): void {
    this.updatedAt = v;
  }
}
