# Exam Paper Data Passing Pit

The pit represents a data passing pattern between parent and child components in React. It is set in an online exam/questionnaire scenario, where we have a paper containing many questions, and a question has its title and choices.

When the user is happy with the choices made, he/she may hit the submit button. The user answers will be compared to the right answers and checked, then the status of the right or wrong answer provided will be shown for each question. In addition, the total score will be calculated by summing up all the individual scores of the correct user selections. After submission, the exam total score will be updated, and all choices for questions will be disabled.

## How this works

The pit implements the functionality in 2 different ways: The pure traditional way and with the Redux store. Both ways are shown side by side in the UI.

### Component Layout

![Component Layout](https://i.imgur.com/zhrLpsd.png)

### Pure traditional way

**Passing down:**

Paper -> Question

``` tsx
  // dataToPassDown is of type:
  type DataToPassDown = {
    data: {
      // questions with choices, initially empty [],
      questions: IQuestion[],
      // stores right answers, is initailly empty {},
      // will contain right answers after submit button is hit.
      rightAnswerStore: IAnswerStore,
      // turns on after submit button is clicked
      isUserAnswerSubmitted: Boolean,
    }
  },

  return (
      // ...
      <main className={paperStyles.paperContent}>
        <QuestionList
          data={dataToPassDown.data}
          // ...
        />
      </main>
  );
```

Question -> Multiple Choice
``` tsx
  // QuestionList.tsx

  // for each question:
  // ...
  <form action="none">
    <MultipleChoice
      data={{
        questionID: id,
        choices,
        isChoiceLocked: data.isUserAnswerSubmitted,
      }}
      // ...
    />
  </form>
```

**Passing up:**

Multiple Choice -> Question

``` tsx

  // MultipleChoice.tsx
  const onSelectionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const currentChoice = choices.find((choice) => choice.id === e.target.value);

    if (currentChoice && events) {
      // Pass up the questionID and the choice made.
      events.onSelectionChange(data.questionID || "missingID", [currentChoice]);
    }
  };
```

``` tsx

  // QuestionList.tsx
  const onSelectionChange = (questionID: string, nextSelections: IChoice[]): void => {
    // Create a new User Answer Store based on current User Answer Store
    const nextUserAnswerStore = {
      ...userAnswerStore,
    };

    // Insert the new selection state
    nextUserAnswerStore[questionID] = nextSelections;

    // Save the state
    setUserAnswerStore(nextUserAnswerStore);
  };

  // for each question:
  // ...
  <form action="none">
    <MultipleChoice
      // ...
      events={{
        // "Listen" to the event
        onSelectionChange,
      }}
    />
  </form>
```

Question -> Paper
``` tsx

  // QuestionList.tsx
  const onRightAnswerStoreChange = (): void => {
    const nextUserAnswerCorrectStore = {
      ...userAnswerCorrectStore,
    };

    // For each question, check the answer and save right questions
    for (const key in userAnswerStore) {
      // key: questionID
      // ...
      const isCorrect = checkUserAnswer(userChoices, rightChoices);

      nextUserAnswerCorrectStore[key] = {
        isCorrect,
        score: question.score,
      };
    }

    // Update correct answer store
    setUserAnswerCorrectStore(nextUserAnswerCorrectStore);

    if (events) {
      // Calculate the score, then pass up the new score
      events.onScoreChange(calculateScore(nextUserAnswerCorrectStore));
    }
  };
```

``` tsx

  // Paper.view.tsx
  const onScoreChange = (newScore: number): void => {
    setScore(newScore);
  };

  return (
      // ...
      <main className={paperStyles.paperContent}>
        <QuestionList
          // ...
          // "Listen" to the event 
          events={{ onScoreChange }}
        />
      </main>
  );

```


**Little notes:**

Q: In `Paper.view.tsx`, why `const [dataToPassDown, setDataToPassDown] = useState({})`? Why not just pass the data down?

A: Then how do you represent the data change when `rightAnswerStore` change?
React cannot detect a change when only a part of an object is different.

Q: In `Paper.view.tsx`, why call `setDataToPassDown()` in a `useEffect()` monitoring `rightAnswerStore` change?

A: Because instead if you do this:

``` tsx
  const onSubmitButtonClick = (e: React.MouseEvent): void => {
    const r = createRightAnswerStore();
    setIsUserAnswerSubmitted(true);
    setRightAnswerStore(createRightAnswerStore());
    setDataToPassDown({
      data: {
        questions,
        rightAnswerStore: r,
        isUserAnswerSubmitted,
      },
    });
  };
```

`setDataToPassDown()` won't wait `setRightAnswerStore()` to complete. The `setState()` calls are all asynchronous in React.

In the end, you pass down an empty rightAnswerStore down to children.

Therefore we have to use `useEffect()` to monitor `rightAnswerStore` change.

Only when it is changed (which means `setRightAnswerStore()` finishes completely) do we start to pass the data down.

### With Redux Store

**Passing down:**

Paper -> Question
``` tsx
// PaperStore.view.tsx
// data is of type:
  type Data = {
    // questions with choices,
    questions: IQuestion[],
  },

  return (
    // ...
    <main className={paperStyles.paperContent}>
      <QuestionListStore data={data} />
    </main>
  );
```

Question -> Multiple Choice
``` tsx
// QuestionListStore.tsx

  // for each question:
  // ...
  <form action="none">
    <MultipleChoiceStore
      data={{
        questionID: id,
        choices,
      }}
    />
  </form>

```

**Passing up:**

(None, in favor of Redux Store)

**Redux Store selectors:**

Store -> Paper
``` tsx
// PaperStore.tsx
  const score = useAppSelector(selectScore);  // To show the total score
```

Store -> Question
``` tsx
// QuestionListStore.tsx
  // To check user answers
  const userAnswerStore = useAppSelector(selectUserAnswerStore);
  // To check user answers, triggers answer check on change
  const rightAnswerStore = useAppSelector(selectRightAnswerStore);
  // Controls of showing user is right or wrong after submission.
  const isUserAnswerSubmitted = useAppSelector(selectIsUserAnswerSubmitted);
```

Store -> Multiple Choice
``` tsx
// MultipleChoiceStore.tsx
  // To get the current userAnswerStore and based on which create a new object, inserting new selection state.
  const userAnswerStore = useAppSelector(selectUserAnswerStore);
  // To disable the choices after submission.
  const isUserAnswerSubmitted = useAppSelector(selectIsUserAnswerSubmitted);
```

**Redux Store dispatchers:**

Paper -> Store
``` tsx
// PaperStore.tsx
  const onSubmitButtonClick = (e: React.MouseEvent): void => {
    // ...
    // Set submitted state to true, so the user answer right or wrong is shown, and choices are disabled.
    dispatch(setIsUserAnswerSubmitted(true));
    // Push the right answers to store, so that the answer check is triggerd and total score get calculated.
    dispatch(setRightAnswerStore(nextRightAnswerStore));
  };
```

Question -> Store
``` tsx
// QuestionListStore.tsx

  const [userAnswerCorrectStore, setUserAnswerCorrectStore] = useState({} as IUserScoreStore);

  const onRightAnswerStoreChange = (): void => {
    // ...
    for (const key in userAnswerStore) {
      // key: questionID
      // ...
      const isCorrect = checkUserAnswer(userChoices, rightChoices);
      nextUserAnswerCorrectStore[key] = {
        isCorrect,
        score: question.score,
      };
    }

    // Update local UserAnswerCorrectStore after checkUserAnswer() for each user answer provided
    setUserAnswerCorrectStore(nextUserAnswerCorrectStore);
    // Calculate the score by summing up scores in UserAnswerCorrectStore and push to Redux Store
    dispatch(setScore(calculateScore(nextUserAnswerCorrectStore)));
  };

  // triggers when rightAnswerStore changes
  useEffect(() => {
    onRightAnswerStoreChange();
  }, [rightAnswerStore]);
```

Multiple Choice -> Store
``` tsx
// MultipleChoiceStore.tsx
  const onSelectionChange = (e: ChangeEvent<HTMLInputElement>): void => {
    // ...
    // Create a new object based on current user selection state 
    const nextUserAnswerStore = {
      ...userAnswerStore,
    };

    // Insert new selection state
    nextUserAnswerStore[questionID] = [
      {
        id: e.target.value,
        value: "",
      },
    ];

    // Update Redux Store
    dispatch(setUserAnswerStore(nextUserAnswerStore));
  };
```

## Development

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

Runs the app in the development mode with `yarn start`<br />
Open [http://localhost:3031](http://localhost:3031) to view it in the browser.

Builds the app for production to the `build` folder with `yarn build`.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Prerequisite

We need React Hooks for both implementations.

``` json
  {
    "@reduxjs/toolkit": "^1.5.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.0"
  }
```
