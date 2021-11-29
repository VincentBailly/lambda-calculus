const code = "((l a (l b b)) hello world)"

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

function eval(tree, env) {
	if (typeof tree === "string") { // var
		return env(tree)
	} else if (tree[0] === "l") { // lambda
		return arg => eval(tree[2], (x) => { return x === tree[1] ? arg : env(x) })
	} else { // function application
		return tree.slice(1).reduce((acc, next) => acc(eval(next, env)), eval(tree[0], env))
	}
}

console.log(JSON.stringify(parse(code), undefined, 2))
console.log(eval(parse(code), (x) => x))
