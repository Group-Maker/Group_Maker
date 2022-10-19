import _ from 'lodash';

const GENERATIONS = 30;
const RANDOM_MUTATIONS = 3;
const MAX_DESCENDANTS_TO_EXPLORE = 100;

const forEachPair = (array, callback) => {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = i + 1; j < array.length; j++) {
      callback(array[i], array[j]);
    }
  }
};

// 가중치 1회 업데이트
const updateWeights = (round, weights) => {
  for (const group of round) {
    forEachPair(group, (a, b) => {
      if (a !== null && b !== null) {
        weights[b][a] = weights[a][b] + 1;
        weights[a][b] = weights[b][a];
      }
    });
  }
};

// 초기값(0)으로 가중치 배열 생성한 뒤 누적 라운드 순회하며 가중치 업데이트 후 반환
const initWeights = (totalPeopleNum, records) => {
  const weights = _.range(totalPeopleNum).map(() => _.range(totalPeopleNum).fill(0));
  records.forEach(round => updateWeights(round, weights));
  return weights;
};

const solver = ({ records, groupNum, peopleArr, totalPeopleNum, forbiddenPairs }) => {
  // 빈 공간 채우도록 초기화
  while (peopleArr.length % groupNum !== 0) {
    peopleArr.push(null);
  }
  const activePeopleNum = peopleArr.length;

  const peoplePerGroup = activePeopleNum / groupNum;
  // 현재 가중치 기준 라운드 점수 반환
  const getScoredRound = (round, weights) => {
    const groupScores = round.map(group => {
      let groupCost = 0;
      forEachPair(group, (a, b) => {
        if (a !== null && b !== null) {
          groupCost += weights[a][b] ** 2;
        }
      });
      return groupCost;
    });
    return {
      groups: round,
      groupsScores: groupScores,
      total: groupScores.reduce((sum, next) => sum + next, 0),
    };
  };

  // null이 고루 분배되는 round 반환
  const generateValidRound = groupNum => {
    const generateRound = () => {
      const people = _.shuffle([...peopleArr]);
      const round = _.range(groupNum).map(i => _.range(peoplePerGroup).map(j => people[i * peoplePerGroup + j]));
      return round;
    };
    const validateRound = round => round.every(group => group.filter(e => e === null).length < 2);
    let round = generateRound();
    while (!validateRound(round)) {
      round = generateRound();
    }
    return round;
  };

  const getSwappedRound = (groups, i, j) => {
    const copy = groups.map(group => group.slice());
    copy[Math.floor(i / peoplePerGroup)][i % peoplePerGroup] =
      groups[Math.floor(j / peoplePerGroup)][j % peoplePerGroup];
    copy[Math.floor(j / peoplePerGroup)][j % peoplePerGroup] =
      groups[Math.floor(i / peoplePerGroup)][i % peoplePerGroup];
    return copy;
  };

  const generateMutations = (candidates, weights) => {
    const mutations = [];
    candidates.forEach(candidate => {
      const scoredGroups = candidate.groups.map((g, i) => ({
        group: g,
        score: candidate.groupsScores[i],
      }));
      const sortedScoredGroups = _.sortBy(scoredGroups, sg => sg.score).reverse();
      const sorted = sortedScoredGroups.map(ssg => ssg.group);

      // Always push the original candidate back onto the list
      mutations.push(candidate);

      // Add every mutation that swaps somebody out of the most expensive group
      // (The first group is the most expensive now that we've sorted them)
      for (let i = 0; i < peoplePerGroup; i++) {
        for (let j = peoplePerGroup; j < activePeopleNum; j++) {
          mutations.push(getScoredRound(getSwappedRound(sorted, i, j), weights));
        }
      }

      // Add some random mutations to the search space to help break out of local peaks
      for (let i = 0; i < RANDOM_MUTATIONS; i++) {
        mutations.push(getScoredRound(generateValidRound(groupNum), weights));
      }
    });
    return mutations;
  };

  // Fill some initial restrictions
  // forbiddenPairs.forEach(group => {
  //   forEachPair(group, (a, b) => {
  //     if (a >= totalSize || b >= totalSize) return;
  //     weights[a][b] = weights[b][a] = Infinity;
  //   });
  // });

  // 현재까지 누적된 rounds를 기준으로 weights 산출
  let roundScore = 0;
  const weights = initWeights(totalPeopleNum, records);
  let topOptions = _.range(5).map(() => getScoredRound(generateValidRound(groupNum), weights));

  let generation = 0;
  while (generation < GENERATIONS && topOptions[0].total > 0) {
    const candidates = generateMutations(topOptions, weights);
    const sorted = _.sortBy(candidates, c => c.total);
    const bestScore = sorted[0].total;
    // Reduce to all the options that share the best score
    topOptions = sorted.slice(
      0,
      sorted.findIndex(opt => opt.total > bestScore)
    );
    // Shuffle those options and only explore some maximum number of them
    topOptions = _.shuffle(topOptions).slice(0, MAX_DESCENDANTS_TO_EXPLORE);
    generation++;
  }
  const bestOption = topOptions[0];
  // records.push(bestOption.groups);
  roundScore += bestOption.total;
  updateWeights(bestOption.groups, weights);
  return {
    newRecord: bestOption.groups,
    roundScore,
    weights,
  };
};

export default solver;
