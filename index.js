const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Seja bem vindo ao app de Metas!";

// let meta = {
    
// }

let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch (erro){
        metas = []
    }
}

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const cadastarMeta = async() => {
    const meta = await input({ message: "Digite sua meta:"})

    if(meta.length == 0) {
        mensagem = "👉 A meta não pode ser vazia!"
        return
    }

    metas.push({
        value: meta,
        checked: false
    })

    mensagem = "👉 Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "👉 Não existem metas!"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
        choices: [...metas],
        instructions: false,
    })
    
    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = "👉 Nenhuma meta selecionada!"
        return
    }


    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
})

        mensagem = "👉 Meta(s) marcadas como concluídas!"
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = "👉 Não existem metas realizadas! 👎 \n"
        return
    }

    await select({
        message: "Metas Realizadas 👉 " + realizadas.length,
        choices: [...realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
        // ou assim
        // return !meta.checked  
    })

    if(abertas.length == 0 ) {
        mensagem = "👉 Não exitem metas abertas! 👍 \n"
        return
    }

    await select({
        message: "Metas Abertas 👉 " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0) {
        mensagem = "👉 Não existem metas!"
        return
    }
    
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false}
    })
    const itensADeletar = await checkbox({
        message: "Selecione item para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0) {
        mensagem = "👉 Nenhum item para deletar!"
        return
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
    })

    mensagem = "👉 Meta(s) deleta(s) com sucesso!"

}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != "") {
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
 
    await carregarMetas()

    while(true) {
        mostrarMensagem();
        await salvarMetas()
        
        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"
                },

                {
                    name: "Listar metas",
                    value: "listar"
                },

                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },

                {
                    name: "Metas abertas",
                    value: "abertas"
                },

                {
                    name: "Deletar metas ",
                    value: "deletar"
                },

                {
                    name: "Sair",
                    value: "sair"
                }
            ]
        })

        switch(opcao) {
            case "cadastrar":
                await cadastarMeta()
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                // console.log("\nMetas realizadas...\n")
                break
            case "abertas":
                await metasAbertas()
                // console.log("\nMetas realizadas...\n")
                break
            case "deletar":
                await deletarMetas()
                // console.log("\nMetas realizadas...\n")
                break
            case "sair":
                console.log("\nATÉ A PRÓXIMA! 👍🤝\n")
                return
        }

    }
}

start()


    // console.log('\n')
    // console.log('COMEÇOU!!!')
    // console.log('\n')