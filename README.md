# Group-Maker

여러 번의 팀프로젝트가 필요한 상황에서 **이전과 최대한 겹치지 않게** 새로운 조를만들어주는 프로그램입니다

see [Group maker](https://connecto-frontend.github.io/group-maker/)

---

## Documentation

### Usage

- Member & Records
  - 명단을 관리하는 화면입니다
    - 인원 추가 / 수정 / 삭제가 가능합니다
  - 이전 기록을 확인할 수 있습니다
- Create Group - Auto
  - 조 짜기 버튼을 누르면 새로운 조를 자동 생성합니다.
  - 현재 멤버 목록과 이전 기록을 바탕으로 최대한 겹치지 않도록 조를 생성합니다.
    - Genetic algorithm 활용
- Create Group - Self
  - 새로운 조를 수동으로 생성합니다

---

### Conventional Commits

ref: https://www.conventionalcommits.org/ko/v1.0.0/

- feat: 기능 개발 관련
- refactor: 리팩토링
- fix: 오류 개선 혹은 버그 패치
- docs: 문서화 작업
- conf: 환경설정 관련
- build: 빌드 관련

---

### Reference

Please see [Good-Enough-Golfers](https://github.com/islemaster/good-enough-golfers)

---

### License

Sesame is Free software, and may be redistributed under the terms of specified in the [LICENSE]() file.
