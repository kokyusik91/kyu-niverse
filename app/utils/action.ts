export const createContents = async (formData: FormData) => {
  'use server';
  const contents = formData.get('contents') as string;
  console.log('contentscontentscontents', contents);
  if (contents.trim().length <= 0) {
    return;
  }
  // try {
  //   const response = await bucketService.createBucket({ bucketName });
  //   await delay(2000);
  //   const bucketId = response.data.data.bucketId;
  //   return bucketId;
  // } catch (err: unknown) {
  //   if (isAxiosError(err)) {
  //     console.log(err);
  //   }
  // } finally {
  //   revalidatePath('/my');
  // }
};
