/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import {
  selectUserAnswerStore, selectRightAnswerStore, selectIsUserAnswerSubmitted, setScore,
} from "src/features/paper/paperSlice";
import { IChoice } from "src/models/choice";
import { ICommonProps } from "src/models/props";
import { IQuestion, IUserScoreStore } from "src/models/question";
import MultipleChoiceStore from "../multipleChoice/multipleChoiceStore";
import styles from "./questionList.module.css";

export interface IQuestionStoreProps extends ICommonProps {
  data: Partial<{
    questions: IQuestion[],
  }>
}

const QuestionListStore = (props: Partial<IQuestionStoreProps>): JSX.Element => {
  const dispatch = useAppDispatch();
  const userAnswerStore = useAppSelector(selectUserAnswerStore);
  const rightAnswerStore = useAppSelector(selectRightAnswerStore);
  const isUserAnswerSubmitted = useAppSelector(selectIsUserAnswerSubmitted);

  const { data } = props;

  const [userAnswerCorrectStore, setUserAnswerCorrectStore] = useState({} as IUserScoreStore);

  const calculateScore = (scoreStore: IUserScoreStore): number => {
    let currentScore = 0;
    for (const key in scoreStore) {
      if (scoreStore[key].isCorrect) {
        currentScore += scoreStore[key].score;
      }
    }
    return currentScore;
  };

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

  const onRightAnswerStoreChange = (): void => {
    // question component compare rightAnswerStore with userAnswerStore
    // then give out right/wrong judgement, shows the status and update the score.

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
      const rightChoices = rightAnswerStore[key];

      const isCorrect = checkUserAnswer(userChoices, rightChoices);

      nextUserAnswerCorrectStore[key] = {
        isCorrect,
        score: question.score,
      };
    }

    setUserAnswerCorrectStore(nextUserAnswerCorrectStore);
    dispatch(setScore(calculateScore(nextUserAnswerCorrectStore)));
  };

  useEffect(() => {
    onRightAnswerStoreChange();
  }, [rightAnswerStore]);

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
      id, title, score, choices,
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

        {isUserAnswerSubmitted && (
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
          <MultipleChoiceStore
            data={{
              questionID: id,
              choices,
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

export default QuestionListStore;
