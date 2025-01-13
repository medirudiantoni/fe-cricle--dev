import { useRef, useState } from 'react';
import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';

// Custom Hook: useConfirm
const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTitle, setIsTitle] = useState("Alert!");
  const [isText, setIsText] = useState("Are you sure?");
  const [isTrueText, setIsTrueText] = useState("Ok");
  const [isFalseText, setIsFalseText] = useState("Cancel");
  const [resolvePromise, setResolvePromise] = useState<(value: boolean) => void>(() => () => {});
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [isTheme, setTheme] = useState("success");

  interface ConfirmType {
    text?: string,
    title?: string,
    theme?: string,
    trueText?: string,
    falseText?: string,
  }

  const confirmDialog = (params?: ConfirmType) => {
    return new Promise<boolean>((resolve) => {
      setIsOpen(true);
      params?.title && setIsTitle(params?.title);
      params?.text && setIsText(params?.text);
      params?.theme && setTheme(params.theme);
      params?.trueText && setIsTrueText(params.trueText);
      params?.falseText && setIsFalseText(params.falseText);
      setResolvePromise(() => resolve);
    });
  };

  const onClose = (result: boolean) => {
    setIsOpen(false);
    resolvePromise(result);
  };

  const AlertDialogComponent = (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={() => onClose(false)}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent background="theme.700" color="white">
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {isTitle}
          </AlertDialogHeader>

          <AlertDialogBody>
            {isText}
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={() => onClose(false)}>
              {isFalseText}
            </Button>
            <Button colorScheme={isTheme == "danger" ? "red" : "green"} onClick={() => onClose(true)} ml={3}>
              {isTrueText}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );

  return { confirmDialog, AlertDialogComponent };
};

export default useConfirm;