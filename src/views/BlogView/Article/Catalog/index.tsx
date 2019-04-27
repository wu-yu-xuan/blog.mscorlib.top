import * as React from 'react';
import { anchor } from './style.scss';
import { Anchor } from 'antd';

const { Link } = Anchor;

export interface Heading {
  id: string;
  text: string;
  children: Heading[]
}

interface ICatalog {
  headings: Heading[];
}

export default function Catalog({ headings }: ICatalog) {
  return (
    <div className={anchor}>
      <Anchor offsetTop={90}>
        {headings.map((value, key) => (
          <Link href={`#${value.id}`} title={value.text} key={key} >
            {!!value.children.length && value.children.map((smallHeading, index) => <Link href={`#${smallHeading.id}`} title={smallHeading.text} key={index} />)}
          </Link>
        ))}
      </Anchor>
    </div>
  )
}