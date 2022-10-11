import {AbstractControl} from "@angular/forms";
import {Observable, Observer, of} from "rxjs";

//retuning promise or observable here means that this validator is a sync one, since we used the file input validity async within the component
export const mimeTypeValidator = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any } | null> => {
  if (typeof control.value === 'string') return of(null);

  const file = control.value as File;
  const reader = new FileReader();

  //we won't use this approch since we soush
  // reader.onloadend = () => {}
  //Now we're going to convert the above line of code to observable

  return new Observable((observer: Observer<any>) => {
    reader.readAsArrayBuffer(file); //To reade the mime type
    reader.onloadend = () => {
      //with using this array we'll look to the actual file not only on the extension.
      const arr = new Uint8Array(reader.result as ArrayBuffer).subarray(0, 4);
      console.log("reader.result", reader.result)
      console.log("Uint8Array", new Uint8Array(reader.result as any))
      console.log("arr", arr)

      let isValid: boolean;
      let header = '';
      for (let i = 0; i < arr.length; i++) {
        header += arr[i].toString(16);
      }

      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if (isValid) {
        observer.next(null);
      } else {
        observer.next({InvalidMimeType: true})
      }

      observer.complete();
    }
  })
}
