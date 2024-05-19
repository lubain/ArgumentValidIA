const ModusPones = (h1, h2) => {
    let resultat
    let norm = separer('-',h2)
    if (norm.length < 2) {
        return undefined
    }
    if (h1 == norm[0]) {
        resultat = norm[1]
    } else if (h1 == norm[1]) {
        resultat = norm[0]
    } else if ((norm[0] == "!"+h1)) {
        resultat = "!"+norm[1]
    } else if ((norm[1] == "!"+h1)) {
        resultat = "!"+norm[0]
    } else if (("!"+norm[0] == h1)) {
        resultat = "!"+norm[1]
    } else if (("!"+norm[1] == h1)) {
        resultat = "!"+norm[0]
    }
    return resultat
}

const ModusTollens = (h1, h2) => {
    return ModusPones(h1, h2)
}

const Syllogisme = (h1, h2) => {
    const normh1 = separer("-", h1)
    const normh2 = separer("-", h2)
    if ((h1.length <= 2)||(h2.length <= 2)||(normh1.length < 2)||(normh2.length < 2)) {
        return undefined
    }
    if (normh1[1] == normh2[0]) {
        return normh1[0]+"->"+normh2[1]
    } else if (normh1[0] == normh2[1]) {
        return normh2[0]+"->"+normh1[1]
    }
}

const Simplification = (tab, h) => {
    const norm = separer("^",h)
    if (norm.length<2) {
        return undefined
    }

    for (let i = 0; i < tab.length; i++) {
        if (trouvreLimplication(tab[i])) {
            for (let j = 0; j < tab[i].length; j++) {
                for (let k = 0; k < norm[0].length; k++) {
                    if (tab[i][j] == norm[0][k]) {
                        return norm[0]
                    }
                }
                for (let k = 0; k < norm[1].length; k++) {
                    if (tab[i][j] == norm[1][k]) {
                        return norm[1]
                    }
                }
            }
        }
    }
    return norm[0]
}

const EquivalanceDeLImplication = (h) => {
    let tmp = []
    const norm = separer("v", h)
    if (norm.length == 1) {
        return undefined
    }
    if (norm[0][0] == "!") {
        let actif = false
        for (let i = 1; i < h.length; i++) {
            if (h[i] == '(') {
                actif = true
            } else if (h[i] == ')') {
                actif = false
            }
            tmp[i-1] = h[i]
            if ((h[i] == "v")&&(!actif)) {
                tmp[i-1] = "->"
            }
        }
    } else {
        return undefined
    }

    let s = ""
    for (let i = 0; i < tmp.length; i++) {
        s += tmp[i]
    }

    h = s
    return s
}

const EquivalanceCommutativite = (h) => {
    const norm = separer("v",h)
    if (norm.length == 1) {
        return undefined
    }
    return norm[1]+"v"+norm[0]
}

const Contrapositivite = (h) => {
    const norm = separer("-",h)
    if (norm[1] == undefined) {
        return undefined
    }
    return "!"+norm[1]+"->"+"!"+norm[0]
}

const RegleDeConjonction = (tab) =>{
    let tmp = []
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].length <= 2) {
            tmp.push(tab[i])
        }
    }
    if (tmp.length < 2) {
        return undefined
    }
    return tmp[0]+'^'+tmp[1]
}

const DeMorgan = () =>{
    
}

const trouvreLimplication = (h) => {
    for (let i = 0; i < h.length; i++) {
        if ((h[i] == "-")&&(h[i+1] == ">")) {
            return true
        }
    }
}

const separer = (relation,h) => {
    let e = []
    let tmp = ""
    let actif = false
    for (let i = 0; i < h.length; i++) {
        let j = 0
        if (h[i] == "(") {
            actif = true
        } else if (h[i] == ")") {
            actif = false
        }
        if ((relation == "v")||(relation == "^")) {
            if ((h[i] != relation)||(actif)) {
                tmp = tmp+h[i]
            } else {
                e.push(tmp)
                tmp = ""
                j++
            }
        } else if (relation == "-") {
            if ((h[i] != "-")||(actif)) {
                tmp = tmp+h[i]
            } else {
                e.push(tmp)
                tmp = ""
                j++
                i++
            }
        }
    }
    e.push(tmp)
    return e
}

const controleDunegation = (h) => {
    let tmp = ""
    for (let i = 0; i < h.length; i++) {
        if ((h[i] == "!")&&(h[i+1] == "!")) {
            i+=1
            continue
        }
        tmp += h[i]
    }
    return tmp
}

const controleDuParentese = (h) => {
    let tmp = ""
    for (let i = 1; i < h.length; i++) {
        if ((h[0] == "(")&&(h[i] == ")")) {
            continue
        }
        tmp += h[i]
    }
    return tmp
}

const trouverLePivot = (tab, isAllUndif, _nbr) => {
    let min = tab[0]
    if (isAllUndif) {
        for (let i = 1; i < tab.length - _nbr; i++) {
            if (tab[i].length < min.length) {
                min = tab[i]
            }
        }
    } else {
        for (let i = 1; i < tab.length; i++) {
            if (tab[i].length < min.length) {
                min = tab[i]
            }
        }
    }
    return min
}

const eliminerDansLaListe = (tab, c) => {
    let tmp = []
    for (let i = 0; i < tab.length; i++) {
        if (tab[i] != c) {
            tmp.push(tab[i])
        }
    }
    return tmp
}

const assosier = (h1, h2) => {
    let liste_2 = []
    const M_pon = ModusPones(h1, h2);
    const M_tol = ModusTollens(h2, h1);
    const Sylo = Syllogisme(h1, h2);
    
    liste_2.push(M_pon)
    liste_2.push(M_tol)
    liste_2.push(Sylo)

    let stock2 = ""

    for (let i = 0; i < liste_2.length; i++) {
        if (liste_2[i] != undefined) {
            stock2 = liste_2[i];
        }
    }
    
    if (stock2 == "") {
        return undefined
    }
    console.log(liste_2);
    stock2 = controleDunegation(stock2)
    return stock2
}

const reformer = (h, tab) =>{
    let liste_1 = []
    
    liste_1.push(Simplification(tab, h))
    liste_1.push(EquivalanceDeLImplication(h))
    liste_1.push(EquivalanceCommutativite(h))
    liste_1.push(Contrapositivite(h))
    
    let stock1 = ""

    for (let i = 0; i < liste_1.length; i++) {
        if (liste_1[i] != undefined) {
            stock1 = liste_1[i];
            break
        }
    }

    if (stock1 == "") {
        return undefined
    }
    stock1 = controleDunegation(stock1)
    console.log(liste_1);
    return stock1
}

let negation = (h) =>{
    let tmp = ''
    let actif = false
    for (let i = 0; i < h.length; i++) {
        if (h[i] == 'v') {
            tmp += "^"
            continue
        } else if (h[i] == '^') {
            tmp += "v"
            continue
        } else if ((h[i] == '-')&&(h[i+1] == '>')) {
            // const norm = separer('-', h)
        } else if (h[i] == '!') {
            continue
        }
        tmp += "!"+h[i]
    }
    return tmp
}

const resolution = (h_n)=>{

    let testPossible = h_n
    let resultat = []
    let nbr = 0
    let pivot = trouverLePivot(testPossible, false)
    let c

    for (let i = 0; i < h_n.length; i++) {
        console.log("H"+(i+1)+":", h_n[i]);
    }

    testPossible = eliminerDansLaListe(testPossible, pivot)

    for (let k = 0; k < h_n.length; k++) {
        console.log(pivot, k);
        console.log(testPossible);
        if (pivot[0] == "(") {
            pivot = controleDuParentese(pivot)
        }

        for (let i = 0; i < testPossible.length; i++) {
            c = assosier(pivot, testPossible[i])
            if (c != undefined) {
                resultat.push(c)
                testPossible = eliminerDansLaListe(testPossible, testPossible[i])
                pivot = c
                break
            }
        }

        if ((c == undefined)&&(testPossible.length > 0)) {
            let s
            for (let i = 0; i < testPossible.length; i++) {
                s = reformer(testPossible[i], testPossible)
                if (s != undefined) {
                    c = assosier(pivot, s)
                    if (c != undefined) {
                        resultat.push(c)
                        testPossible = eliminerDansLaListe(testPossible, testPossible[i])
                        pivot = c
                        break
                    }
                    testPossible[i] = s
                }
            }
            if (c == undefined) {
                const neg = negation(pivot, testPossible)
                s = reformer(pivot, testPossible)
                if (s != undefined) {
                    for (let i = 0; i < h_n.length; i++) {
                        if (pivot == h_n[i]) {
                            testPossible.push(pivot)
                            k--
                        }
                    }
                    pivot = s
                    k--
                    continue
                }
                nbr++
                pivot = trouverLePivot(testPossible, true, nbr)
                testPossible = eliminerDansLaListe(testPossible, pivot)
            }
        }
    }

    return resultat
}

console.log(negation("p^!q"));

let h_n = [
    'p->q',
    'q->(r^s)',
    '!rv(!tvu)',
    "p^t"
]

resolution(h_n)

form2.addEventListener("submit", (e)=>{
    e.preventDefault()
    h_n = []
    for (let i = 0; i < hypotheseList.childElementCount; i++) {
        h_n.push(hypotheseList.children[i].children[0].children[0].value)
    }

    resultat = resolution(h_n);

    const pre = document.createElement('pre');
    const container = document.createElement('div');
    const h = resultat[resultat.length - 1]
    pre.textContent = h
    container.appendChild(pre);
    cn.appendChild(pre);
})