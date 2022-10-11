import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

import {PostsService} from "../posts.service";
import {Post} from "../post.model";
import {mimeTypeValidator} from "./mime-type.validator";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  public isLoading = false;
  public form: FormGroup | undefined;
  public imgPreview: string | undefined;
  private editMode = false;
  private editedPostId: string | null | undefined;

  constructor(
    public postsService: PostsService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.initForm();
    this.activatedRoute.paramMap.subscribe(paramMap => {
      if (paramMap.has('id')) {
        this.editedPostId = paramMap.get('id');

        this.editMode = true;
        this.isLoading = true;
        this.postsService.getPost(this.editedPostId as any).subscribe((post: Post) => {
          this.form?.setValue({
            title: post.title,
            content: post.content,
            image: post.imagePath
          });
          this.imgPreview = post.imagePath;
          this.isLoading = false;
        });
      }
    });
  }

  onAddPost() {
    if (this.form?.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.editMode) {
      this.postsService.updatePost(
        this.editedPostId as any,
        this.form?.value.title,
        this.form?.value.content,
        this.form?.value.image
      );
    } else {
      this.postsService.addPost(this.form?.value.title, this.form?.value.content, this.form?.value.image);
    }

    this.form?.reset();
    this.isLoading = false;
  }

  onImagePicked(e: Event) {
    const file = (e.target as any).files[0];

    this.form?.patchValue({image: file});
    this.form?.get('image')?.updateValueAndValidity();

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imgPreview = reader.result as any;
    }
  }

  private initForm() {
    this.form = new FormGroup<any>({
      title: new FormControl('', [Validators.required, Validators.minLength(3)]),
      content: new FormControl('', [Validators.required]),
      image: new FormControl('', [Validators.required], [mimeTypeValidator])
    });
  }
}
