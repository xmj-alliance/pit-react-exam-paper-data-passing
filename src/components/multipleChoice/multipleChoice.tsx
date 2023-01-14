/* eslint-disable no-restricted-syntax */
import { ChangeEvent } from "react";
import { IChoice } from "src/models/choice";
import { ICommonProps } from "src/models/props";
import styles from "./multipleChoice.module.css";

export interface IMultipleChoiceProps extends ICommonProps {
  data: Partial<{
    questionID: string,
    choices: IChoice[],
    isChoiceLocked: boolean,
  }>,
  events: {
    onSelectionChange: (questionID: string, nextSelections: IChoice[]) => void;
  }
}

const MultipleChoice = (props: Partial<IMultipleChoiceProps>): JSX.Element => {
  const { data, events } = props;

  if (!data) {
    return (
      <section className={styles.choices}>
        Initializing...
      </section>
    );
  }

  const {
    questionID, choices, isChoiceLocked,
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

  const onSelectionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const currentChoice = choices.find((choice) => choice.id === e.target.value);

    if (currentChoice && events) {
      events.onSelectionChange(data.questionID || "missingID", [currentChoice]);
    }
  };

  const choicesToDisplay = choices.map((choice) => {
    const { id, value } = choice;
    return (
      <label key={id} className={styles.caption}>
        <input
          type="radio"
          name={`answer-${questionID}`}
          value={id}
          onChange={onSelectionChange}
          disabled={isChoiceLocked}
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

export default MultipleChoice;
