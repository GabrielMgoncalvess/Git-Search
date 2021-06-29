import React, { useState, useEffect } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';
import logo from '../../essets/logo.svg';

interface RepositoriesParams {
    repositoriy: string;
}

interface  RepositoryInt {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
}

interface Issuesint {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string
    }
}


const Repository: React.FC = () => {

    const [repository, setRepository] = useState<RepositoryInt | null>(null);
    const [issues, setIssues] = useState<Issuesint[]>([]);

    const { params } = useRouteMatch<RepositoriesParams>();

    useEffect(() => {
        api.get(`repos/${params.repositoriy}`).then(response => {
            setRepository(response.data);
        })
    }, [params.repositoriy]);

    useEffect(() => {
        api.get(`repos/${params.repositoriy}/issues`).then(response => {
            setIssues(response.data);
        })
    }, [params.repositoriy]);

    return (
        <>
            <Header>
                <img src={logo} alt="Github Explorer" />
                <Link to="/"><FiChevronLeft size={16} />Voltar</Link>
            </Header>
            
            { repository && (
                <RepositoryInfo>
                <div>
                   <img src={repository.owner.avatar_url} alt={repository.owner.login} />
                   <section>
                       <strong>{repository.full_name}</strong>
                       <p>{repository.description}</p>
                   </section>
                </div>
                <ul>
                    <li>
                        <strong>{repository.stargazers_count}</strong>
                        <span>Stars</span>
                    </li>
                    <li>
                        <strong>{repository.forks_count}</strong>
                        <span>Forks</span>
                    </li>
                    <li>
                        <strong>{repository.open_issues_count}</strong>
                        <span>Issues abertas</span>
                    </li>
                </ul>
            </RepositoryInfo>
            )}

            <Issues>
                {issues.map(issue =>(
                <a key={issue.id} href={issue.html_url}>
                <div>
                    <strong>{issue.title}</strong>
                    <p>{issue.user.login}</p>
                </div>
                <FiChevronRight size={20} />
                </a>
                ))}
            </Issues>
        </>
    )
}

export default Repository;
