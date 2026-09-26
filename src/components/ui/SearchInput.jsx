import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  .group {
    display: flex;
    line-height: 28px;
    align-items: center;
    position: relative;
    max-width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "190px")};
    width: 100%;
  }

  .input {
    width: 100%;
    height: 40px;
    line-height: 28px;
    padding: 0 1rem;
    padding-left: 2.5rem;
    border: 2px solid transparent;
    border-radius: 8px;
    outline: none;
    background-color: #f3f3f4;
    color: #0d0c22;
    transition: 0.3s ease;
    font-size: 13px;
  }

  :is(.dark, [data-theme="dark"]) & .input {
    background-color: #1a1a20;
    color: #f4f4f6;
  }

  .input::placeholder {
    color: #9e9ea7;
  }

  .input:focus,
  .input:hover {
    outline: none;
    border-color: rgba(234, 76, 137, 0.4);
    background-color: #fff;
    box-shadow: 0 0 0 4px rgb(234 76 137 / 10%);
  }

  :is(.dark, [data-theme="dark"]) & .input:focus,
  :is(.dark, [data-theme="dark"]) & .input:hover {
    background-color: #141418;
    border-color: rgba(234, 76, 137, 0.55);
    box-shadow: 0 0 0 4px rgb(234 76 137 / 18%);
  }

  .icon {
    position: absolute;
    left: 1rem;
    fill: #9e9ea7;
    width: 1rem;
    height: 1rem;
    pointer-events: none;
  }

  .clear-btn {
    position: absolute;
    right: 0.75rem;
    color: #9e9ea7;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    padding: 0;
  }
  .clear-btn:hover {
    color: #0d0c22;
  }
  :is(.dark, [data-theme="dark"]) & .clear-btn:hover {
    color: #fff;
  }
`;

export const SearchInput = ({
  fullWidth = false,
  placeholder = "Search",
  value,
  onChange,
  onClear,
  className = "",
  ...props
}) => {
  return (
    <StyledWrapper $fullWidth={fullWidth} className={className}>
      <div className="group">
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z" />
          </g>
        </svg>
        <input
          placeholder={placeholder}
          type="search"
          className="input"
          value={value}
          onChange={onChange}
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="clear-btn"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
    </StyledWrapper>
  );
};

export default SearchInput;
