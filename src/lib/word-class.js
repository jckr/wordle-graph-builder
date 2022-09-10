const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
/**
 *  @typedef {{[key: string]: string|number}} Moves
 */
/**
 *  @typedef {{[key: string]: string|number|Moves}} Tree
 */
/**
 * @typedef {Object} Solution
 * @property {string | null} grade
 * @property {string} solution
 */
/**
 * @typedef {Object} Branch
 * @property {string} word
 * @property {string} grade
 * @property {boolean} canBeSolution
 * @property {number} size
 * @property {Solution[]} children
 */

export default class Word {
	/**
	 * @param {string} word
	 */
	constructor(word) {
		this.word = word;
		this.letters = word.split('');
		/** @type {{[key: string]: string}} */
		this.scorecache = {};
		const letterSet = new Set(this.letters);

		/**
		 * @param {{[key: string]: boolean}} prev
		 * @param {string} curr
		 */
		const reducer = (prev, curr) => {
			prev[curr] = letterSet.has(curr);
			return prev;
		};

		this.hasLetter = allLetters.reduce(reducer, {});
	}

	/**
	 * @param {string} letter
	 */
	has(letter) {
		return {
			/**
			 * @param {number} index
			 * @returns boolean
			 */
			at: (index) => this.letters[index] === letter,
			/**
			 * @param {number} index
			 * @returns boolean
			 */
			notAt: (index) => this.hasLetter[letter] && this.letters[index] !== letter
		};
	}
	/**
	 *  @param {string} entry
	 *  @returns {string}
	 */
	grades(entry) {
		if (!this.scorecache[entry]) {
			this.scorecache[entry] = entry
				.split('')
				.map((letter, index) => {
					if (this.hasLetter[letter]) {
						return this.letters[index] === letter ? 'P' : 'p';
					}
					return 'a';
				})
				.join('');
		}
		return this.scorecache[entry];
	}
	/**
	 *  @param {string[]} entries
	 *  @returns {{[key: string]: string[]}}
	 */
	groups(entries) {
		/**
		 * @type {{[key: string]: string[]}}
		 */
		const init = {};
		return entries.reduce((prev, curr) => {
			const grade = this.grades(curr);
			prev[grade] = prev[grade] || [];
			prev[grade].push(curr);
			return prev;
		}, init);
	}
	/**
	 *  @param {string[]} entries
	 *  @returns {number}
	 */
	scores(entries) {
		const groups = this.groups(entries);
		return (
			Object.values(groups).filter((group) => group.length === 1).length +
			0.5 * Number(entries.includes(this.word))
		);
	}

	/**
	 * @param {string[]} entries
	 * @params {Moves} moves
	 * @returns Tree */
	makeTree(entries, moves) {
		const tree = { ...this.groups(entries) };
		let nbLeaves = 0;
		for (const [groupName, remainingWords] of Object.entries(tree)) {
			if (remainingWords.length > 1) {
				const secondMoveGroups = new Word(moves[groupName]).groups(remainingWords);
				const secondMoveWins = Object.entries(secondMoveGroups)
					.filter(([key, group]) => group.length === 1)
					.reduce((prev, [key, group]) => {
						prev[key] = group[0];
						nbLeaves++;
						return prev;
					}, {});
				const secondMoveLosses = Object.entries(secondMoveGroups)
					.filter(([key, group]) => group.length > 1)
					.reduce((prev, [key, group]) => {
						prev.others = (prev?.others || 0) + group.length;
						nbLeaves++;
						return prev;
					}, {});
				tree[groupName] = {
					move: moves[groupName],
					...secondMoveWins,
					...secondMoveLosses
				};
			} else {
				tree[groupName] = remainingWords[0];
				nbLeaves++;
			}
		}
		return {
			word: this.word,
			tree,
			nbLeaves
		};
	}
}

/**
 * @param {string} grade
 * @returns {number} */
const gradeToNumber = (grade) => {
	const letters = grade.split('');
	return letters.reverse().reduce((prev, letter, index) => {
		if (letter === 'P') {
			return prev + 1000 + 10 * index;
		}
		if (letter === 'p') {
			return prev + 100 + index;
		}
		return prev;
	}, 0);
};

/** 
 * @param {string} word
 * @param {Tree} tree
 */
function makeDataset(word, tree) {
	/** @type {(Branch|Solution)[]} */
	const children = [];

	const result = { word, children, canBeSolution: true, size: 0 };
	const branches = Object.entries(tree.tree).sort(
		(a, b) => gradeToNumber(b[0]) - gradeToNumber(a[0])
	);
	for (const [grade, branch] of branches) {
		if (branch.move) {
			// adding node
			const { move, others, ...moves } = branch;
			/** @type {Branch} */
			const child = {
				grade,
				word: move,
				canBeSolution: Boolean(branch.PPPPP),
				size: 0,
				children: []
			};
			for (const [childGrade, solution] of Object.entries(moves).sort(
				(a, b) => gradeToNumber(b[0]) - gradeToNumber(a[0])
			)) {
				if (childGrade !== 'PPPPP') {
					child.children.push({ grade: childGrade, solution });
					child.size++;
					result.size++;
				}
			}
			if (others) {
				child.children.push({ grade: null, solution: `${others} others` });
				child.size++;
				result.size++;
			}
			result.children.push(child);
		} else {
			// adding solution
			if (grade !== 'PPPPP') {
				result.size++;
				result.children.push({ grade, solution: branch });
			}
		}
	}
	return result;
}
