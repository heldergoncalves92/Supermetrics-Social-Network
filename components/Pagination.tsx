
// The API aims to simplify and ease the responsibilities of the Pagination component
// This way it's only reponsible to render the info that is passed on props
// There are 3 different click events on purpose. This way the next page is computed corretly by avoiding possible race conditions
interface IPaginationProps {
    current: number;
    numberOfPages: number;
    pageOptionClicked(newPage: number): void;
    previousPageClicked(): void;
    nextPageClicked(): void;
}

const Pagination = ({
    current,
    numberOfPages,
    pageOptionClicked,
    previousPageClicked,
    nextPageClicked,
}: IPaginationProps): JSX.Element | null => {

    function renderElement(content: string, onClick: () => void, isSelected = false): JSX.Element{
        return <li key={content} className={isSelected ? "active" : ""}>
            <a onClick={onClick}>{content}</a>
        </li>;
    }

    function renderPageNumbers(): JSX.Element[] {
        const pageElements: JSX.Element[] = [];

        for(let i = 1; i<= numberOfPages; i++){
            pageElements.push(renderElement(i.toString(), () => pageOptionClicked(i), i === current));
        }
        return pageElements;
    }

    if (numberOfPages <= 1) {
        return null;
    }
    
    return (
      <ul className="pagination">
          {current !== 1 ? renderElement("<", () => previousPageClicked()): null}

          {renderPageNumbers()}

          {current !== numberOfPages ? renderElement(">", () => nextPageClicked()): null}
      </ul>
    );
  }
  
  export default Pagination;