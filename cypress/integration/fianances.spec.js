/// <reference types="cypress" />
import{ format, prepareLocalStorage } from '../support/utls'
//cy.viewport
//arquivos de config
//configs por linha de comando

context('Dev Finances Agilizei', () => {
    //hooks
    //trechos de de codigos executados antes e depois de cada testes
    //before antes de todos ps testes
    //beforeEch antes de cada teste
    //after depois de todos os testes
    //afterEach depois de todos os testes

    beforeEach('Acessar Pagina',() => {
        cy.visit('https://devfinance-agilizei.netlify.app', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)//inserindo dados ao entrar no sistema

            }
        })
        
    });

    it('Cadastrar entradas', () => {        
        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('#amount').type(12)
        cy.get('#date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length', 3)

    });

    it('Cadastrar Saidas', () => {        
        cy.get('#transaction .button').click()
        cy.get('#description').type('Mesada')
        cy.get('#amount').type(-12)
        cy.get('#date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
        
    });
    it('Remover entradas e saidas', () => {
        
        
        //estrategia 1: voltar para o elemento pai e avançar para um td imagem
        cy.get('td.description')
        .contains("Mesada")
        .parent()
        .find('img[onclick="Transaction.remove(0)"]').click()

        //estrategia 2: buscar todos os irmãos, e buscar o que tem img + atr
        cy.get('td.description')
        .contains("Suco Kapo")
        .siblings()
        .children('img[onclick="Transaction.remove(0)"]').click()
        cy.get('#data-table tbody tr').should('have.length', 0)
    });
    it('Validar saldo com diversas transações', () => {
        //capturar as linhas com as transações
        //capturar os textos da coluna
        //formatar esses valores das linhas

        //somar os valores de entrada e saida
        //capturar o texto do total
        //comparar o somatorio de entrada e despesas com o total

        const entrada = 'Mesada'
        const saida = 'KinderOvo'

        cy.get('#transaction .button').click()
        cy.get('#description').type(entrada)
        cy.get('#amount').type(20)
        cy.get('#date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()

        cy.get('#transaction .button').click()
        cy.get('#description').type(saida)
        cy.get('#amount').type(-150)
        cy.get('#date').type('2021-03-21')
        cy.get('button').contains('Salvar').click()
        
        //elemento, indice da lista, propriedade da lista

        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
        .each(($el, index, $list) => {
            cy.log(index)
            cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
                cy.log(text)
                cy.log(format(text))
                if(text.includes('-')){
                    expenses = expenses + format(text)
                }else{
                    incomes = incomes + format(text)
                }
                cy.log(`entradas`, incomes)
                cy.log(`saidas`, expenses)

            })

        }) 

    cy.get('#totalDisplay').invoke('text').then(text => {
        cy.log(`valo total`, format(text))
        let formattedTotalDysplay = format(text)
        let expectedTotal = incomes + expenses

        expect(formattedTotalDysplay).to.eq(expectedTotal)

    })    

        
    });
});