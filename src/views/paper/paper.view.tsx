/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from "react";
import QuestionList from "src/components/question/questionList";
import { IChoice } from "src/models/choice";
import { IAnswerStore } from "src/models/paper";
import { IQuestion } from "src/models/question";
import paperStyles from "src/views/paper.module.css";
import styles from "./paper.view.module.css";

const questions: IQuestion[] = [
  {
    id: "cab00fc6-5611-4304-8183-741bd344e0bd",
    type: "type-multipleChoice",
    title: "Q17: What is life's greatest illusion?",
    score: 50,
    choices: [
      {
        id: "556163eb-239f-4220-ab80-a235fe7de674",
        value: "(A) Hapiness",
      },
      {
        id: "078a036a-cf85-40b3-9dda-9a8f03422af4",
        value: "(B) Glory",
      },
      {
        id: "0bfefcb9-44f8-4335-b102-b94571b3e53a",
        value: "(C) Innocence",
      },
      {
        id: "0779314f-71b0-4754-821f-ac7c00d534d7",
        value: "(D) Sorrow",
      },
    ],
  },
];

const questionsWithRightChoices: Partial<IQuestion>[] = [
  {
    id: "cab00fc6-5611-4304-8183-741bd344e0bd",
    rightChoices: [
      {
        id: "0bfefcb9-44f8-4335-b102-b94571b3e53a",
        value: "(C) Innocence",
      },
    ],
  },
];

const PaperView = (): JSX.Element => {
  const [score, setScore] = useState(0);
  const [rightAnswerStore, setRightAnswerStore] = useState({} as IAnswerStore);
  const [dataToPassDown, setDataToPassDown] = useState({
    data: {
      questions,
      rightAnswerStore: {},
      isUserAnswerSubmitted: false,
    },
  });
  const [isUserAnswerSubmitted, setIsUserAnswerSubmitted] = useState(false);

  useEffect(() => {
    setDataToPassDown({
      data: {
        questions,
        rightAnswerStore,
        isUserAnswerSubmitted,
      },
    });
  }, [rightAnswerStore]);

  const createRightAnswerStore = (): IAnswerStore => {
    const localRightAnswerStore = {} as IAnswerStore;
    for (const question of questionsWithRightChoices) {
      localRightAnswerStore[question.id || "missingID"] = question.rightChoices as IChoice[];
    }
    return localRightAnswerStore;
  };

  const onSubmitButtonClick = (e: React.MouseEvent): void => {
    setIsUserAnswerSubmitted(true);
    setRightAnswerStore(createRightAnswerStore());
  };

  const onScoreChange = (newScore: number): void => {
    setScore(newScore);
  };

  return (
    <section className={styles.paperView}>
      <header>
        <h1 className={paperStyles.paperTitle}>Super hard exam</h1>
        <p className={paperStyles.scoreHolder}>
          <small>Score: &nbsp;</small>
          <span>{score}</span>
        </p>
      </header>
      <main className={paperStyles.paperContent}>
        <QuestionList
          data={dataToPassDown.data}
          events={{ onScoreChange }}
        />
      </main>
      <footer className={paperStyles.bottomControls}>
        <button type="button" onClick={onSubmitButtonClick}> Submit </button>
      </footer>
    </section>
  );
};

export default PaperView;
