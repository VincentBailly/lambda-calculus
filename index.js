const code = "((l a (l b a)) hello)"

function parseLambda(code) {

}

function normalizeCode (code) {
	return code.replace(/\(/g, " ( ")
		.replace(/\)/g, " ) ")
		.split(" ")
		.filter(o => o !== "")
}

function createTree(tokens) {
	return tokens.reduce((acc, token) => {
		if (token === "(") {
			return { children: [], parent: acc }
		} else if (token === ")") {
			return {...acc.parent,
				children: [...acc.parent.children,
					   acc.children]}
		} else {
			return {...acc, children: [...acc.children,token]}
		}
	}, {children: []}).children[0]

}

function parse(code) {
	const tokens = normalizeCode(code)
	const tree = createTree(tokens)
	return tree
}

function eval(code) {
	const tree = parse(code)
	return tree
}

console.log(JSON.stringify(eval(code), undefined, 2))
