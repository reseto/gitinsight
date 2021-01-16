/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import classnames from 'classnames';
import { useQuery } from '@apollo/react-hooks';
import {
  statsAuthorsQueryStaleness,
  statsAuthorsQueryTop30,
  statsGlobalQuery,
} from '../../graphql/queries';
import Wrapper from '../layout/Wrapper';
import PageTitleWithDate from '../content/PageTitleWithDate';
import { Calendar, ChevronRight, Code, Flag, Folder, Mail, TrendingUp } from './../primitives/Icon';
import Card from '../primitives/Card/Card';
import Heat from '../primitives/Heat/Heat';
import Nr from '../primitives/Nr/Nr';
import { isNotEmptyArray } from '../../utils/isEmptyUtil';
import { getAvatarFromEmail } from '../../utils/getAvatarFromEmailUtil';
import { getDate } from '../../utils/getDateUtil';
import { getNameFromEmail } from '../../utils/getNameFromEmailUtil';
import { stalenessStatus } from '../../utils/stalenessStatusUtil';

const renderContributors = ({ statsAuthors }) => {
  const output = [];
  if (statsAuthors && isNotEmptyArray(statsAuthors)) {
    statsAuthors.map(sa => {
      const {
        author,
        commitDateLast: commitDateLastAuthor,
        commits: commitsAuthor,
        daysActive,
        // daysSinceLastCommit,
        // impact,
        impactRatio,
        repositories: repositoriesAuthor,
        staleness,
      } = sa;
      output.push(
        <li key={uuidv4()}>
          <Link
            to={`/contributor/${author}`}
            className="block hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <div className="flex items-center px-4 py-4 sm:px-6">
              <div className="min-w-0 flex-1 flex items-center">
                <span className="inline-block relative">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={getAvatarFromEmail(author)}
                    alt={getNameFromEmail(author)}
                  />
                  <span
                    className={classnames(
                      'absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white dark:ring-gray-800',
                      staleness ? stalenessStatus(staleness, 'color') : '',
                    )}
                  />
                </span>
                <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 dark:text-fav-orange-middle truncate">
                      {getNameFromEmail(author)}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-200">
                      <Mail className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400 dark:text-gray-300" />
                      <span className="truncate">{author}</span>
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <span className="text-gray-400 dark:text-gray-300">Last commit: </span>
                        <time dateTime="2020-01-07">{getDate(commitDateLastAuthor)}</time>
                      </p>
                      {/* <p className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-200">
                        <CheckCircle className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" />
                        Completed phone screening
                      </p> */}
                      <div className="min-w-0 flex-1 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 md:gap-2 lg:gap-4 flex items-center text-sm text-gray-500 dark:text-gray-200 mt-2">
                        <div className="flex items-center">
                          <Code className="flex-shrink-0 mr-1.5 h-5 w-5 text-fav-green-dark" />
                          <span className="mr-3">
                            <Nr value={commitsAuthor} size="md" thousandify />
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Folder className="flex-shrink-0 mr-1.5 h-5 w-5 text-fav-purple-middle" />
                          <span className="mr-3">
                            <Nr value={repositoriesAuthor} size="md" thousandify />
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-fav-green-light" />
                          <span className="mr-3">
                            <Nr value={(daysActive / 365).toFixed(1)} size="md" thousandify />
                          </span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="flex-shrink-0 mr-1.5 h-5 w-5 text-fav-turquoise" />
                          <span className="mr-3">
                            <Nr value={impactRatio.toFixed(0)} size="md" thousandify />
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Flag className="flex-shrink-0 mr-1.5 h-5 w-5 text-fav-pink-shock" />
                          <span className="mr-3">{staleness.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          </Link>
        </li>,
      );
      return null;
    });
  }
  return output;
};

const Contributors = ({ statsAuthors }) => (
  <>
    {statsAuthors && isNotEmptyArray(statsAuthors) ? (
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md mt-5">
        <ul className="divide-y divide-gray-200 dark:divide-gray-900">
          {renderContributors({ statsAuthors })}
        </ul>
      </div>
    ) : null}
  </>
);

const PageContributors = () => {
  const {
    data: {
      statsGlobal,
      statsGlobal: {
        commitDateFirst,
        commitDateLast,
        commits,
        contributors,
        // contributorsList, // array list
        repositories,
      } = {},
    } = {},
  } = useQuery(statsGlobalQuery);
  const { data: { statsAuthors } = {} } = useQuery(statsAuthorsQueryTop30);
  const { data: { statsAuthors: statsAuthorsStaleness } = {} } = useQuery(
    statsAuthorsQueryStaleness,
  );
  return (
    <Wrapper pageType="contributors">
      {statsGlobal && (
        <>
          <PageTitleWithDate title="Contributors" from={commitDateFirst} until={commitDateLast} />
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            <Card
              type="contributors"
              heading="Contributors"
              stat={<Nr value={contributors} size="md" thousandify />}
            />
            <Card
              type="repositories"
              heading="Repositories"
              stat={<Nr value={repositories} size="md" thousandify />}
            />
            <Card
              type="code"
              heading="Commits"
              stat={<Nr value={commits} size="md" thousandify />}
            />
          </dl>
          <Heat statuses={statsAuthorsStaleness} />
          <Contributors statsAuthors={statsAuthors} />
        </>
      )}
    </Wrapper>
  );
};
export default PageContributors;
