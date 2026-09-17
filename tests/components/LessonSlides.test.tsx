import {describe,expect,it} from "vitest";
import {fireEvent,render,screen,within} from "@testing-library/react";
import {LessonSlides} from "@/app/components/LessonSlides";
describe('reading slides',()=>{
 it('advances only on input, supports keyboard and keeps boundaries',()=>{
  const {container}=render(<LessonSlides id="V2-cli-loop"/>);
  expect(container.querySelector('video')).toBeNull();
  expect(screen.getByRole('button',{name:'← 이전'})).toBeDisabled();
  expect(within(screen.getByRole('group',{name:/^\d:/})).getByText('1 · 변경 범위 정하기')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'다음 →'}));
  expect(within(screen.getByRole('group',{name:/^\d:/})).getByText('2 · 근거 수집')).toBeInTheDocument();
  fireEvent.keyDown(screen.getByRole('button',{name:'다음 →'}),{key:'ArrowLeft'});
  expect(screen.getByRole('button',{name:'← 이전'})).toBeDisabled();
  fireEvent.click(screen.getByRole('button',{name:/4번 슬라이드/}));
  expect(screen.getByRole('button',{name:'다음 →'})).toBeDisabled();
 });
});
