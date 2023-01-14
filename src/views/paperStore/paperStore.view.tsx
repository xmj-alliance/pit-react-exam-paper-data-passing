/* eslint-disable no-restricted-syntax */
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import QuestionListStore from "src/components/question/questionListStore";
import { selectScore, setIsUserAnswerSubmitted, setRightAnswerStore } from "src/features/paper/paperSlice";
import { IChoice } from "src/models/choice";
import { IAnswerStore } from "src/models/paper";
import { IQuestion } from "src/models/question";
import paperStyles from "src/views/paper.module.css";
import styles from "./paperStore.view.module.css";

const data = {
  questions: [
    {
      id: "d2f4af45-5c5f-4de3-8e3c-bfbb4294aed1",
      type: "type-multipleChoice",
      title: "Q20: After a blast that ran through the clouds, the Angular Biters completely lost their ____.",
      score: 50,
      choices: [
        {
          id: "d0048ae4-d4a7-48b3-9c61-65ad6035f317",
          value: "(A) Gas Station",
        },
        {
          id: "bf30f676-dda7-46ca-a033-7cda652d98ad",
          value: "(B) Music Player",
        },
        {
          id: "2ea6f9cf-2f6c-4b3a-8f8b-61579cee85c7",
          value: "(C) Process Tree",
        },
        {
          id: "1abbc251-9489-4ee7-b1ad-1f8a045d8b1c",
          value: "(D) Response",
        },
      ],
    },
  ],
};

const questionsWithRightChoices: Partial<IQuestion>[] = [
  {
    id: "d2f4af45-5c5f-4de3-8e3c-bfbb4294aed1",
    rightChoices: [
      {
        id: "1abbc251-9489-4ee7-b1ad-1f8a045d8b1c",
        value: "(D) Response",
      },
    ],
  },
];

const createRightAnswerStore = (): IAnswerStore => {
  const rightAnswerStore = {} as IAnswerStore;

  for (const question of questionsWithRightChoices) {
    rightAnswerStore[question.id || "missingID"] = question.rightChoices as IChoice[];
  }

  return rightAnswerStore;
};

const PaperStoreView = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const score = useAppSelector(selectScore);

  const onSubmitButtonClick = (e: React.MouseEvent): void => {
    const nextRightAnswerStore = createRightAnswerStore();
    dispatch(setIsUserAnswerSubmitted(true));
    dispatch(setRightAnswerStore(nextRightAnswerStore));
  };

  return (
    <section className={styles.paperStoreView}>
      <header>
        <h1 className={paperStyles.paperTitle}>Super hard exam (with Redux Store)</h1>
        <p className={paperStyles.scoreHolder}>
          <small>Score:&nbsp;</small>
          <span>{score}</span>
        </p>
      </header>
      <main className={paperStyles.paperContent}>
        <QuestionListStore data={data} />
      </main>
      <footer className={paperStyles.bottomControls}>
        <button type="button" onClick={onSubmitButtonClick}> Submit </button>
      </footer>
    </section>
  );
};

export default PaperStoreView;
