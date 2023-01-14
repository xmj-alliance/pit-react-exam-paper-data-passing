import { ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { selectIsUserAnswerSubmitted, selectUserAnswerStore, setUserAnswerStore } from "src/features/paper/paperSlice";
import { IChoice } from "src/models/choice";
import { ICommonProps } from "src/models/props";
import styles from "./multipleChoice.module.css";

export interface IMultipleChoiceStoreProps extends ICommonProps {
  data: Partial<{
    questionID: string,
    choices: IChoice[],
  }>
}

const MultipleChoiceStore = (props: Partial<IMultipleChoiceStoreProps>): JSX.Element => {
  const dispatch = useAppDispatch();
  const userAnswerStore = useAppSelector(selectUserAnswerStore);
  const isUserAnswerSubmitted = useAppSelector(selectIsUserAnswerSubmitted);

  const { data } = props;

  const onSelectionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const questionID = data?.questionID || "missingID";

    const nextUserAnswerStore = {
      ...userAnswerStore,
    };

    nextUserAnswerStore[questionID] = [
      {
        id: e.target.value,
        value: "",
      },
    ];

    dispatch(setUserAnswerStore(nextUserAnswerStore));
  };

  if (!data) {
    return (
      <section className={styles.choices}>
        Initializing...
      </section>
    );
  }

  const {
    questionID, choices,
  } = data;

  if (!questionID) {
    return (
      <section className={styles.choices}>
        Error: question ID not provided
      </section>
    );
  }

  if (!choices) {
    return (
      <section className={styles.choices}>
        Loading question choices...
      </section>
    );
  }

  if (choices.length <= 0) {
    return (
      <section className={styles.choices}>
        Error: No choices found
      </section>
    );
  }

  const choicesToDisplay = choices.map((choice) => {
    const { id, value } = choice;
    return (
      <label key={id} className={styles.caption}>
        <input
          type="radio"
          name={`answer-${questionID}`}
          value={id}
          onChange={onSelectionChange}
          disabled={isUserAnswerSubmitted}
        />
        {value}
      </label>
    );
  });

  return (
    <section className={styles.choices}>
      {choicesToDisplay}
    </section>
  );
};

export default MultipleChoiceStore;
