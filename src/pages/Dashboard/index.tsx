import React, {useState, FormEvent, useEffect} from 'react';
import { Link } from 'react-router-dom';

import { Title, Form, Repositories, Error } from './style';
import { FiChevronRight } from 'react-icons/fi'
import logo from '../../essets/logo.svg';
import api from '../../services/api';



interface  RepositoryInt {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    };
}

const Dashboard: React.FC = () => {

    const [newRepo, setNewRepo] = useState('');
    const [inputError, setInputError] = useState('');
    const [repositories, setRepositories] = useState<RepositoryInt[]>(() => {
        const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if (storagedRepositories) {
            return JSON.parse(storagedRepositories);
        }

        return [];
    });

    useEffect (() => {
            localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

    async function hanfleAddRepositoriy(event: FormEvent<HTMLFormElement> ) {
        event.preventDefault();

        if (!newRepo) {
            setInputError ('Digite autor/nome do repositório')
            return;
        }

        try {
        const response = await api.get<RepositoryInt>(`/repos/${newRepo}`);

        const repository = response.data; 

        setRepositories ([...repositories, repository]);
        setNewRepo('');
        setInputError('');
        } catch (err) {
            setInputError ('Erro  na busca por esse repositório');
        }
    }

    return (
        <>
            <img src={logo} alt="Github Explorer" />
            <Title>Explore repositórios no GitHub</Title>

            <Form hasError={!!inputError} onSubmit={hanfleAddRepositoriy}>
                <input value={newRepo} onChange={(e) => setNewRepo(e.target.value)} placeholder="Digite o nome do repositório" />
                <button type="submit">Pesquisar</button>
            </Form>

            { inputError && <Error>{inputError}</Error> }

            <Repositories>
                {repositories.map(repository => (
                    <Link key={repository.full_name} to={`/repository/${repository.full_name}`}>
                    <img key={repository.full_name} src={repository.owner.avatar_url} alt={repository.owner.login} />
                <div>
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>
                </div>
                <FiChevronRight size={20} />
                </Link>
                ))}
                
            </Repositories>
        </>
    )
}

export default Dashboard;
