import * as DialogPrimitive from "@radix-ui/react-dialog";
import React, { useCallback, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

export const useDialog = <T,>(initialData?: T) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData ?? null);

  const open = useCallback((newData?: T) => {
    setIsOpen(true);
    setData(newData ?? null);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return {
    isOpen,
    data,
    open,
    close,
  };
};

export const Dialog = DialogPrimitive.Root;

export const DialogContent: React.FC<DialogPrimitive.DialogContentProps> = (
  props
) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-30" />

    <DialogPrimitive.Content
      className="fixed top-1/2 left-1/2 z-50 max-h-[90%] w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-white p-4 md:w-full"
      {...props}
    >
      {props.children}

      <DialogPrimitive.Close asChild>
        <button className="hover:text-contrast-dark absolute top-[22px] right-[18px] transition-colors">
          <AiOutlineClose />
        </button>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
);

export const DialogTitle: React.FC<DialogPrimitive.DialogTitleProps> = (
  props
) => (
  <DialogPrimitive.Title className="mb-2 flex text-xl font-bold" {...props} />
);
export const DialogDescription: React.FC<
  DialogPrimitive.DialogDescriptionProps
> = (props) => (
  <DialogPrimitive.Description
    className="text-contrast-secondary text-sm"
    {...props}
  />
);
export const DialogClose = DialogPrimitive.Close;
