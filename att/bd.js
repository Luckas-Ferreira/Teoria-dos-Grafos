async function fazerRequisicao() {
	const data = {
		cursos: [5],
		disciplinas: [],
		professores: [],
		lenghts: true
	};
	const requestOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify(data),
	};

	try {
		const response = await fetch(
			"https://arapiraca.ufal.br/extensao/eidi/api/api.php?method=GetGraph",
			requestOptions
		);
		const responseData = await response.json();
		json = responseData;
		query = "CREATE \n";
		edges = "";
		for (let key in json) {
			if (key == "cursos" || key == "disciplinas" || key == "professores") {
				for (let d in json[key]) {
					dd = json[key][d];
					nome = dd["label"];
					id = dd["id"];
					n = dd["group"];
					ch = dd["lenght"]["ch"][0];
					q1 = `(${key + id
            }:${n} {name: '${nome}',title: '${nome}', id: ${id}, ch: ${ch}}), \n`;
					query += q1;
				}
			} else if (key == "links") {
				cnd = {
					cursos: "disciplinas",
					disciplinas: "professores"
				};
				lista = {
					cursos: 'contém',
					disciplinas: 'ministrado'
				}
				for (let r in json[key]) {
					if (r == "cursos" || r == "disciplinas") {
						for (let edge in json[key][r]) {
							ldc = []
							for (let e in json[key][r][edge]) {
								c = `(${r+edge})-[:ministrado]->(${cnd[r]+json[key][r][edge][e]}), \n`

								ldc.push(json[key][r][edge][e]);
								if (r == "disciplinas") {
									edges += c;
								}
							}
							if (r == "cursos") {
								ldcT = ldc.join(", ");
								console.log(`MATCH (a:${r} {id: ${edge}}) FOREACH (id IN [${ldcT}] | MERGE (b: ${cnd[r]} {id: id}) MERGE (a)-[:contém]->(b) )`);

							}

						}
					}
				}
			}
		}

		console.log(query + edges);
	} catch (error) {
		console.error(error);
	}
}

fazerRequisicao();