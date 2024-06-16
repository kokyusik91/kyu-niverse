"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="cursor-pointer rounded-lg bg-red-200 p-3"
    >
      {pending ? "제출중.." : "버킷추가"}
    </button>
  );
}

export default SubmitButton;
