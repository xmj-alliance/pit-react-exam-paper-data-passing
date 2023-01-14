/* eslint-disable max-len */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import { useEffect, useState } from "react";
import MultipleChoice from "src/components/multipleChoice/multipleChoice";
import { IChoice } from "src/models/choice";
import { IAnswerStore } from "src/models/paper";
import { ICommonProps } from "src/models/props";
import { IQuestion, IUserScoreStore } from "src/models/question";
import styles from "./questionList.module.css";

export interface IQuestionProps extends ICommonProps {
  data: Partial<{
    questions: IQuestion[],
    rightAnswerStore: IAnswerStore,
    isUserAnswerSubmitted: boolean,
  }>,
  events: {
    onScoreChange: (newScore: number) => void
  }
}

const QuestionList = (props: Partial<IQuestionProps>): JSX.Element => {
  const { data, events } = props;

  const [userAnswerStore, setUserAnswerStore] = useState({} as IAnswerStore);
  const [userAnswerCorrectStore, setUserAnswerCorrectStore] = useState({} as IUserScoreStore);

  const checkUserAnswer = (userChoices?: IChoice[] | null, rightChoices?: IChoice[] | null): boolean => {
    if (!userChoices || !rightChoices) {
      return false;
    }

    if (userChoices.length !== rightChoices.length) {
      return false;
    }

    for (const choice of userChoices) {
      const rightChoice = rightChoices.find((e) => e.id === choice.id);
      if (!rightChoice) {
        return false;
      }
    }

    return true;
  };

  const calculateScore = (scoreStore: IUserScoreStore): number => {
    let currentScore = 0;
    for (const key in scoreStore) {
      if (scoreStore[key].isCorrect) {
        currentScore += scoreStore[key].score;
      }
    }
    return currentScore;
  };

  const onSelectionChange = (questionID: string, nextSelections: IChoice[]): void => {
    const nextUserAnswerStore = {
      ...userAnswerStore,
    };

    nextUserAnswerStore[questionID] = nextSelections;

    setUserAnswerStore(nextUserAnswerStore);
  };

  const onRightAnswerStoreChange = (): void => {
    const nextUserAnswerCorrectStore = {
      ...userAnswerCorrectStore,
    };

    for (const key in userAnswerStore) {
      // key: questionID
      const question = data?.questions?.find((q) => q.id === key);
      if (!question) {
        continue;
      }

      const userChoices = userAnswerStore[key];
      let rightChoices: IChoice[] = [];

      if (data && data.rightAnswerStore) {
        rightChoices = data.rightAnswerStore[key];
      }

      const isCorrect = checkUserAnswer(userChoices, rightChoices);

      nextUserAnswerCorrectStore[key] = {
        isCorrect,
        score: question.score,
      };
    }

    setUserAnswerCorrectStore(nextUserAnswerCorrectStore);

    if (events) {
      events.onScoreChange(calculateScore(nextUserAnswerCorrectStore));
    }
  };

  useEffect(() => {
    onRightAnswerStoreChange();
  }, [data, data?.rightAnswerStore]);

  if (!data) {
    return (
      <section>
        Loading data...
      </section>
    );
  }

  const { questions } = data;

  if (!questions) {
    return (
      <section>
        Loading questions...
      </section>
    );
  }

  if (questions.length <= 0) {
    return (
      <section>
        no questions found
      </section>
    );
  }

  const questionsToDisplay = questions.map((question) => {
    const {
      id, title, score, choices, rightChoices,
    } = question;

    return (
      <li key={id}>
        {id && (
          <p className={styles.idHolder}>
            <small>
              id:
              {id}
            </small>
          </p>
        )}

        {data.isUserAnswerSubmitted && (
          <p className={styles.idHolder}>
              {
                userAnswerCorrectStore[id]?.isCorrect
                  ? (
                    <small>
                      Great Correct!
                    </small>
                  )
                  : (
                    <small>
                      oh no Incorrect!
                    </small>
                  )
              }
          </p>
        )}

        <h2 className={styles.title}>
          {title}
          <span>
            &nbsp; (score: &nbsp;
            {score}
            pt)
          </span>
        </h2>
        <form action="none">
          <MultipleChoice
            data={{
              questionID: id,
              choices,
              isChoiceLocked: data.isUserAnswerSubmitted,
            }}
            events={{
              onSelectionChange,
            }}
          />
        </form>
      </li>
    );
  });

  return (
    <section>
      <ul>
        {questionsToDisplay}
      </ul>
    </section>
  );
};

export default QuestionList;
