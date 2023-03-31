type BlobType = Blob | Uint8Array | ArrayBuffer;

export async function createBlob(url: string): Promise<BlobType> {
   const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
         resolve(xhr.response);
      };
      xhr.onerror = () => {
         reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", url, true);
      xhr.send(null);
   });
   return blob as BlobType;
}
