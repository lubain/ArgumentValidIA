def separer(separateur, h):
    e, tmp, actif = [], "", False
    i = 0
    while i < len(h): # pour chaque caractere de l'hypothese
        if h[i] == "(": # verifier s'il contient du paranthese
            actif = True
        elif h[i] == ")":
            actif = False
        # si la separateur est 
        if (separateur in ["v", "^"] and (h[i] != separateur or actif)) or (separateur == "-" and (h[i] != "-" or actif)):
            tmp += h[i]
        else:
            e.append(tmp)
            tmp = ""
            if separateur == "-":
                i += 1
        i += 1
    e.append(tmp)
    return e

def ModusPones(h1, h2):
    resultat = None
    norm = separer('-', h2)
    if len(norm) < 2:
        return None
    if h1 == norm[0]:
        resultat = norm[1]
    elif h1 == norm[1]:
        resultat = norm[0]
    elif norm[0] == "!" + h1:
        resultat = "!" + norm[1]
    elif norm[1] == "!" + h1:
        resultat = "!" + norm[0]
    elif "!" + norm[0] == h1:
        resultat = "!" + norm[1]
    elif "!" + norm[1] == h1:
        resultat = "!" + norm[0]
    return resultat

def ModusTollens(h1, h2):
    return ModusPones(h1, h2)

def Syllogisme(h1, h2):
    normh1 = separer("-", h1)
    normh2 = separer("-", h2)
    if len(h1) <= 2 or len(h2) <= 2 or len(normh1) < 2 or len(normh2) < 2:
        return None
    if normh1[1] == normh2[0]:
        return f"{normh1[0]}->{normh2[1]}"
    elif normh1[0] == normh2[1]:
        return f"{normh2[0]}->{normh1[1]}"
    return None

def Simplification(tab, h):
    norm = separer("^", h)
    if len(norm) < 2:
        return None
    for t in tab:
        if trouvreLimplication(t):
            for ch in t:
                if ch in norm[0]:
                    return norm[0]
                if ch in norm[1]:
                    return norm[1]
    return norm[0]

def EquivalanceDeLImplication(h):
    norm = separer("v", h)
    if len(norm) == 1:
        return None
    if norm[0][0] == "!":
        tmp = []
        actif = False
        for i in range(1, len(h)):
            if h[i] == '(':
                actif = True
            elif h[i] == ')':
                actif = False
            if h[i] == "v" and not actif:
                tmp.append("->")
            else:
                tmp.append(h[i])
        return "".join(tmp)
    return None

def EquivalanceCommutativite(h):
    norm = separer("v", h)
    if len(norm) == 1:
        return None
    return f"{norm[1]}v{norm[0]}"

def Contrapositivite(h):
    norm = separer("-", h)
    if len(norm) < 2:
        return None
    return f"!{norm[1]}->!{norm[0]}"

def RegleDeConjonction(tab):
    tmp = [t for t in tab if len(t) <= 2]
    if len(tmp) < 2:
        return None
    return f"{tmp[0]}^{tmp[1]}"

def DeMorgan():
    pass

def trouvreLimplication(h):
    return "->" in h

def controleDunegation(h):
    return "".join("" if h[i] == "!" and h[i+1] == "!" else h[i] for i in range(len(h)))

def controleDuParentese(h):
    return "".join(h[i] for i in range(1, len(h)) if not (h[0] == "(" and h[i] == ")"))

def trouverLePivot(tab, isAllUndif, _nbr=0):
    return min(tab[:-_nbr] if isAllUndif else tab, key=len)

def eliminerDansLaListe(tab, c):
    return [t for t in tab if t != c]

def assosier(h1, h2):
    liste_2 = [ModusPones(h1, h2), ModusTollens(h2, h1), Syllogisme(h1, h2)]
    stock2 = next((item for item in liste_2 if item is not None), None)
    if not stock2:
        return None
    print(liste_2)
    return controleDunegation(stock2)

def reformer(h, tab):
    liste_1 = [Simplification(tab, h), EquivalanceDeLImplication(h), EquivalanceCommutativite(h), Contrapositivite(h)]
    stock1 = next((item for item in liste_1 if item is not None), None)
    if not stock1:
        return None
    print(liste_1)
    return controleDunegation(stock1)

def negation(h):
    tmp = ''
    for ch in h:
        if ch == 'v':
            tmp += "^"
        elif ch == '^':
            tmp += "v"
        elif ch == '-' and h[h.index(ch)+1] == '>':
            pass  # séparé par "-",
        elif ch == '!':
            continue
        tmp += "!" + ch
    return tmp

def conclusion(hypothese):
    testPossible = hypothese
    resultat = []
    nbr = 0
    k = 0
    pivot = trouverLePivot(testPossible, False)
    for i, h in enumerate(hypothese):
        print(f"H{i+1}:", h)

    testPossible = eliminerDansLaListe(testPossible, pivot)
    while k < len(hypothese):
        print(pivot, k)
        print(testPossible)
        if pivot[0] == "(":
            pivot = controleDuParentese(pivot)
        
        for i in range(len(testPossible)):
            c = assosier(pivot, testPossible[i])
            if c:
                resultat.append(c)
                testPossible = eliminerDansLaListe(testPossible, testPossible[i])
                pivot = c
                break
        
        if not c and testPossible:
            for i in range(len(testPossible)):
                s = reformer(testPossible[i], testPossible)
                if s:
                    c = assosier(pivot, s)
                    if c:
                        resultat.append(c)
                        testPossible = eliminerDansLaListe(testPossible, testPossible[i])
                        pivot = c
                        break
                    testPossible[i] = s
            if not c:
                neg = negation(pivot)
                s = reformer(pivot, testPossible)
                if s:
                    if pivot in hypothese:
                        testPossible.append(pivot)
                        k = k - 1
                    pivot = s
                    continue
                nbr += 1
                pivot = trouverLePivot(testPossible, True, nbr)
                testPossible = eliminerDansLaListe(testPossible, pivot)
        k += 1
    return resultat

hypothese = [
    'p->r',
    'r->s',
    'tv!s',
    "!tvu",
    "!u"
]
conclusion(hypothese)